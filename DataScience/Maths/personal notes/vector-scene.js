'use strict';

globalThis.VectorSceneReady = Promise.all([
  import('three'),
  import('three/addons/controls/OrbitControls.js')
]).then(([THREE, { OrbitControls }]) => {
  return function createVectorScene(stage) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f4f7f7');
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-label', 'Projected vector space');
    stage.prepend(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 2000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.autoRotateSpeed = 0.5;
    let content = new THREE.Group();
    scene.add(content);
    let labels = [];
    let extent = 3;
    let planar = false;
    let latest = null;
    let rendering = true;
    const point = values => new THREE.Vector3(values[0] || 0, values[2] || 0, -(values[1] || 0));
    const clock = new THREE.Clock();

    function line(start, end, color, opacity = 1) {
      const material = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
      const object = new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), material);
      content.add(object);
    }

    function label(text, position, color, priority = 1) {
      const element = document.createElement('span');
      element.className = 'plot-label';
      element.textContent = text;
      element.style.color = color;
      stage.append(element);
      labels.push({ element, position, priority });
    }

    function arrow(values, color, name, emphasized = false) {
      const end = point(values);
      const length = end.length();
      if (length < extent * 1e-10) return;
      const direction = end.clone().normalize();
      const head = Math.min(length * 0.28, extent * 0.12);
      const helper = new THREE.ArrowHelper(direction, new THREE.Vector3(), length, color, head, head * 0.55);
      content.add(helper);
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(extent * (emphasized ? 0.009 : 0.006), extent * (emphasized ? 0.009 : 0.006), Math.max(length - head * 0.7, extent * 1e-8), 8),
        new THREE.MeshBasicMaterial({ color })
      );
      shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      shaft.position.copy(direction).multiplyScalar((length - head * 0.7) / 2);
      content.add(shaft);
      label(name, end, color, emphasized ? 0 : 1);
    }

    function clear() {
      labels.forEach(item => item.element.remove());
      labels = [];
      content.traverse(object => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
        else object.material?.dispose();
      });
      scene.remove(content);
      content = new THREE.Group();
      scene.add(content);
    }

    function reset() {
      controls.target.set(0, 0, 0);
      const distance = extent * 3.2 * Math.max(1, 1 / camera.aspect);
      camera.position.copy(planar ? new THREE.Vector3(0, 1, 0.0001) : new THREE.Vector3(1, 0.8, 1)).normalize().multiplyScalar(distance);
      controls.minDistance = extent * 1.7;
      controls.maxDistance = extent * 12;
      camera.near = extent * 0.001;
      camera.far = extent * 100;
      camera.updateProjectionMatrix();
      controls.update();
    }

    function resize() {
      if (!stage.clientWidth || !stage.clientHeight) return;
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(stage.clientWidth, stage.clientHeight);
      reset();
      draw();
    }

    function update(options) {
      latest = options;
      const previousExtent = extent;
      const previousPlanar = planar;
      clear();
      planar = options.planar;
      controls.enableRotate = !planar;
      if (planar) controls.autoRotate = false;
      const all = [...options.vectors, options.result, ...(options.target ? [options.target] : [])];
      extent = (Math.max(...all.map(vector => Math.hypot(...vector))) || 1.8) * 1.2;
      const axisDirections = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      axisDirections.forEach((values, index) => {
        if (planar && index === 2) return;
        const direction = point(values);
        line(direction.clone().multiplyScalar(-extent), direction.clone().multiplyScalar(extent), '#b1beb9');
        label(options.axisNames[index], direction.clone().multiplyScalar(extent * 1.03), '#6c7977', 3);
      });
      const rank = options.analysis.rank;
      if (options.showSpan && rank === 2) {
        const first = point(options.analysis.orthonormalBasis[0]);
        const second = point(options.analysis.orthonormalBasis[1]);
        const normal = new THREE.Vector3().crossVectors(first, second).normalize();
        const grid = new THREE.GridHelper(extent * 1.8, 8, '#aacac3', '#c2d8d2');
        grid.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        content.add(grid);
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(extent * 1.8, extent * 1.8), new THREE.MeshBasicMaterial({ color: '#14837d', opacity: 0.075, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
        plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        content.add(plane);
      } else if (options.showSpan && rank === 1) {
        const direction = point(options.analysis.orthonormalBasis[0]);
        line(direction.clone().multiplyScalar(-extent), direction.clone().multiplyScalar(extent), '#14837d', 0.75);
      } else if (options.showSpan && rank === 3) {
        const box = new THREE.BoxGeometry(extent * 1.45, extent * 1.45, extent * 1.45);
        content.add(new THREE.LineSegments(new THREE.EdgesGeometry(box), new THREE.LineBasicMaterial({ color: '#bfccc8', transparent: true, opacity: 0.4 })));
        box.dispose();
      }
      options.vectors.forEach((vector, index) => {
        if (options.visible?.[index] !== false) arrow(vector, options.colors[index], options.names?.[index] || `x${index + 1}`);
      });
      arrow(options.result, '#202e35', options.resultName || 'x', true);
      const origin = new THREE.Mesh(new THREE.SphereGeometry(extent * 0.014, 16, 10), new THREE.MeshBasicMaterial({ color: '#202e35' }));
      content.add(origin);
      label('0', new THREE.Vector3(), '#596864', 2);
      if (options.target) {
        const target = point(options.target);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(extent * 0.027, 16, 12), new THREE.MeshBasicMaterial({ color: '#cf4b4b' }));
        dot.position.copy(target);
        content.add(dot);
        label('b', target, '#cf4b4b', 0);
        line(point(options.result), target, '#cf4b4b', 0.7);
      }
      labels.sort((first, second) => first.priority - second.priority);
      if (previousPlanar !== planar || !camera.position.length()) reset();
      else camera.position.multiplyScalar(extent / previousExtent);
      controls.minDistance = extent * 1.7;
      controls.maxDistance = extent * 12;
      camera.near = extent * 0.001;
      camera.far = extent * 100;
      camera.updateProjectionMatrix();
      draw();
    }

    function draw() {
      if (!rendering || !stage.clientWidth || !stage.clientHeight) return;
      controls.update(Math.min(clock.getDelta(), 0.05));
      renderer.render(scene, camera);
      const occupied = [];
      for (const item of labels) {
        const projected = item.position.clone().project(camera);
        item.element.hidden = Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1 || Math.abs(projected.z) > 1;
        if (item.element.hidden) continue;
        const width = item.element.offsetWidth;
        const height = item.element.offsetHeight;
        const left = Math.max(8, Math.min(stage.clientWidth - width - 8, (projected.x + 1) * stage.clientWidth / 2 + 7));
        const preferred = (1 - projected.y) * stage.clientHeight / 2 - 18;
        let top = preferred;
        let placed = false;
        for (let attempt = 0; attempt < 18; attempt++) {
          top = Math.max(14, Math.min(stage.clientHeight - height - 58, preferred + Math.ceil(attempt / 2) * (height + 4) * (attempt % 2 ? 1 : -1)));
          if (!occupied.some(rect => left < rect.right + 3 && left + width + 3 > rect.left && top < rect.bottom + 2 && top + height + 2 > rect.top)) { placed = true; break; }
        }
        item.element.hidden = !placed;
        if (!placed) continue;
        item.element.style.transform = `translate(${left}px, ${top}px)`;
        occupied.push({ left, top, right: left + width, bottom: top + height });
      }
    }

    new ResizeObserver(resize).observe(stage);
    renderer.setAnimationLoop(draw);
    resize();
    return {
      update, reset,
      setVisible(value) { if (rendering === value) return; rendering = value; if (value) { resize(); if (latest) update(latest); } },
      rotate(value) { controls.autoRotate = value && !planar; return controls.autoRotate; },
      zoom(factor) { const length = THREE.MathUtils.clamp(camera.position.length() * factor, controls.minDistance, controls.maxDistance); camera.position.setLength(length); draw(); },
      image() {
        draw();
        const canvas = document.createElement('canvas');
        canvas.width = renderer.domElement.width;
        canvas.height = renderer.domElement.height;
        const context = canvas.getContext('2d');
        context.drawImage(renderer.domElement, 0, 0);
        const bounds = stage.getBoundingClientRect();
        const ratio = canvas.width / bounds.width;
        context.font = `600 ${12 * ratio}px Georgia`;
        context.textBaseline = 'top';
        labels.filter(item => !item.element.hidden).forEach(item => {
          const rect = item.element.getBoundingClientRect();
          const left = (rect.left - bounds.left) * ratio;
          const top = (rect.top - bounds.top) * ratio;
          context.fillStyle = '#f4f7f7';
          context.fillRect(left, top, rect.width * ratio, rect.height * ratio);
          context.fillStyle = item.element.style.color;
          context.fillText(item.element.textContent, left + 5 * ratio, top + 3 * ratio);
        });
        return canvas.toDataURL('image/png');
      }
    };
  };
});