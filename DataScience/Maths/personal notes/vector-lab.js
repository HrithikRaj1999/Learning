'use strict';

(async () => {
  const colors = ['#087f80', '#c65345', '#3978bc', '#a57513', '#8856a1', '#548942'];
  const storageKey = 'essential-maths-vector-lab-v1';
  const app = document.getElementById('app');
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const iconButton = (id, name, image) => `<button type="button" id="${id}" class="icon-button" aria-label="${name}" title="${name}">${icon(image)}</button>`;
  app.innerHTML = `
    <header class="app-header">
      <div class="brand">${icon('waypoints')}<div><h1>Vector Lab</h1><p class="eyebrow">Essential Mathematics / Lecture 3</p></div></div>
      <div class="actions" aria-label="Workspace actions">
        ${iconButton('undo', 'Undo edit', 'undo-2')}${iconButton('redo', 'Redo edit', 'redo-2')}
        ${iconButton('import-workspace', 'Import workspace JSON', 'upload')}${iconButton('export-workspace', 'Export workspace JSON', 'download')}
        ${iconButton('export-image', 'Export graph PNG', 'camera')}
        <input id="import-file" type="file" accept=".json,application/json" hidden>
      </div>
    </header>
    <nav class="tabs" role="tablist" aria-label="Vector topics">
      <button type="button" role="tab" data-view="explore" aria-selected="true">${icon('axis-3d')}Explore</button>
      <button type="button" role="tab" data-view="basis" aria-selected="false">${icon('columns-3')}Basis &amp; rank</button>
      <button type="button" role="tab" data-view="solve" aria-selected="false">${icon('equal')}Solve Ax = b</button>
      <button type="button" role="tab" data-view="transform" aria-selected="false">${icon('move-up-right')}Transform</button>
      <button type="button" role="tab" data-view="practice" aria-selected="false">${icon('notebook-pen')}Practice</button>
    </nav>
    <div class="workspace-bar">
      <label class="field">Space <select id="space-dimension" aria-label="Coordinate space dimension">${[1,2,3,4,5,6].map(value => `<option value="${value}">R${value}</option>`).join('')}</select></label>
      <label class="field">Vectors <input id="vector-count" type="number" min="1" max="6" step="1" aria-label="Number of generating vectors"></label>
      <label class="field">Example <select id="example-select"><option value="custom">Custom</option><option value="four">Four vectors in R3</option><option value="plane">Horizontal plane</option><option value="parallel">Parallel vectors</option><option value="tilted">Tilted plane</option><option value="six">Six-dimensional basis</option><option value="zero">Zero span</option></select></label>
      <span id="workspace-stat" class="workspace-stat"></span>
    </div>
    <div id="notice" class="notice" role="status">Loading matrix and graphics libraries...</div>
    <main id="workbench" class="workbench" data-view="explore">
      <div class="main-panel">
        <section id="visual-panel" aria-label="Vector visualization">
          <div class="plot-toolbar">
            <div class="segmented" aria-label="Representation"><button type="button" data-plot="3d" aria-pressed="true">3D</button><button type="button" data-plot="2d" aria-pressed="false">2D</button><button type="button" data-plot="coordinates" aria-pressed="false">All coordinates</button></div>
            <div id="projection-fields" class="projection-fields"><span>Axes</span>${[0,1,2].map(index => `<select id="axis-${index}" data-axis="${index}" aria-label="Projection axis ${index + 1}"></select>`).join('')}</div>
          </div>
          <div class="plot-heading"><h2 id="plot-title">Span in R3</h2><span id="plot-rank"></span></div>
          <div class="plot-surface">
            <div id="stage"></div><div id="coordinate-chart" hidden></div>
            <div id="plot-tools" class="plot-tools">${iconButton('rotate', 'Start rotation', 'play')}${iconButton('reset-view', 'Reset view', 'rotate-ccw')}${iconButton('zoom-in', 'Zoom in', 'zoom-in')}${iconButton('zoom-out', 'Zoom out', 'zoom-out')}</div>
          </div>
          <div class="plot-options"><label class="check-label"><input id="show-span" type="checkbox" checked>Span</label><label class="check-label"><input id="basis-only" type="checkbox">Basis arrows only</label><span id="projection-warning" class="projection-warning"></span></div>
          <p id="projection-note" class="plot-note"></p>
          <div id="result-band" class="result-band"></div>
        </section>
        <section id="analysis-panel" class="analysis-content" hidden></section>
      </div>
      <aside class="inspector" aria-label="Vector inputs">
        <section><div class="section-heading"><h3>Generating vectors</h3><span id="input-space" class="quiet"></span></div><div id="vector-editor" class="coordinate-scroll"></div><div id="vector-status" class="status-line"></div></section>
        <section id="coefficient-section"><div class="section-heading"><h3>Coefficients</h3><span class="quiet">c<sub>i</sub></span></div><div id="coefficient-editor"></div></section>
        <section id="target-section" hidden><h3>Target b</h3><div id="target-editor" class="target-grid"></div><p class="quiet" style="margin-top:12px">A c = b; c contains the unknown coefficients.</p><button id="use-solution" class="command" type="button">${icon('check')}Use solution in Explore</button></section>
        <section id="transform-section" hidden><h3>Transformation T</h3><select id="transform-preset" class="full-select" aria-label="Transformation preset"><option value="custom">Custom matrix</option><option value="identity">Identity</option><option value="double">Scale by 2</option><option value="swap">Swap first two coordinates</option><option value="project">Set last coordinate to zero</option></select><div id="transform-editor" class="coordinate-scroll"></div></section>
        <section id="concept-section"><details><summary>Space, span &amp; subspace</summary><div id="concept-content"></div></details></section>
      </aside>
    </main>
    <footer class="app-footer"><span>Numerical calculations &middot; relative tolerance 10<sup>-10</sup> &middot; local workspace</span><span><a href="../Class%20material/Lecture%203.pdf">Lecture 3</a> &middot; Three.js / ml-matrix / ECharts</span></footer>`;

  const scenePromise = globalThis.VectorSceneReady.catch(() => null);
  let math;
  let scene;
  let chart;
  let analysis;
  let solution;
  let chartData;
  let state;
  let rotating = false;
  let timer = null;
  let seconds = 600;
  let reduction = [];
  let reductionIndex = 0;
  const past = [];
  const future = [];
  const practiceAnswers = {};
  const refreshIcons = () => globalThis.lucide?.createIcons();
  refreshIcons();
  const element = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const notice = message => { element('notice').textContent = message; element('notice').hidden = !message; };

  function defaults() {
    return { version: 1, dimension: 3, count: 4, vectors: [[1,0,0,0,0,0],[0,1,0,0,0,0],[0,0,1,0,0,0],[1,1,0,0,0,0],[0,0,0,0,1,0],[0,0,0,0,0,1]], coefficients: [1,1,1,0.5,0,0], target: [2,1,0,0,0,0], transform: Array.from({length:6}, (_, row) => Array.from({length:6}, (_, column) => Number(row === column))), axes: [0,1,2], plot: '3d', view: 'explore', showSpan: true, basisOnly: false };
  }

  function normalize(input) {
    if (!input || input.version !== 1 || !Number.isInteger(input.dimension) || input.dimension < 1 || input.dimension > 6 || !Number.isInteger(input.count) || input.count < 1 || input.count > 6) throw new Error('Workspace version, dimension, and vector count are invalid.');
    const result = defaults();
    result.dimension = input.dimension;
    result.count = input.count;
    for (const key of ['vectors','transform']) {
      if (!Array.isArray(input[key]) || input[key].length !== 6 || input[key].some(row => !Array.isArray(row) || row.length !== 6 || row.some(value => !Number.isFinite(value) || Math.abs(value) > 1e6))) throw new Error(`${key} must be a finite 6 by 6 array.`);
      result[key] = input[key].map(row => [...row]);
    }
    for (const key of ['coefficients','target']) {
      if (!Array.isArray(input[key]) || input[key].length !== 6 || input[key].some(value => !Number.isFinite(value) || Math.abs(value) > 1e6)) throw new Error(`${key} must contain six finite numbers.`);
      result[key] = [...input[key]];
    }
    if (['explore','basis','solve','transform','practice'].includes(input.view)) result.view = input.view;
    if (['3d','2d','coordinates'].includes(input.plot)) result.plot = input.plot;
    result.axes = [0,1,2].map(index => index < result.dimension ? index : null);
    if (Array.isArray(input.axes) && input.axes.length === 3 && input.axes.every(axis => axis === null || Number.isInteger(axis) && axis >= 0 && axis < result.dimension)) {
      const active = input.axes.filter(axis => axis !== null);
      if (new Set(active).size === active.length) result.axes = [...input.axes];
    }
    result.showSpan = input.showSpan !== false;
    result.basisOnly = input.basisOnly === true;
    return result;
  }

  function checkpoint() { past.push(structuredClone(state)); if (past.length > 60) past.shift(); future.length = 0; }
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {} }
  const vectors = () => state.vectors.slice(0, state.count).map(vector => vector.slice(0, state.dimension));
  const coefficients = () => state.coefficients.slice(0, state.count);
  const tex = value => globalThis.katex ? katex.renderToString(value, { throwOnError: false, strict: 'ignore' }) : escape(value);
  const formula = value => `<div class="math-line">${tex(value)}</div>`;
  const column = vector => `\\begin{pmatrix}${vector.map(math.formatTex).join('\\\\')}\\end{pmatrix}`;
  const tuple = vector => `(${vector.map(math.formatTex).join(',\\ ' )})`;
  const names = indices => indices.length ? indices.map(index => `x_{${index + 1}}`).join(', ') : '\\varnothing';
  function combination(values, symbol = 'x') {
    const terms = [];
    values.forEach((value, index) => {
      if (value === 0) return;
      const magnitude = Math.abs(value);
      const vectorName = symbol === 'T(x)' ? `T(x_{${index + 1}})` : `${symbol}_{${index + 1}}`;
      const term = `${magnitude === 1 ? '' : `(${math.formatTex(magnitude)})`}${vectorName}`;
      terms.push(`${value < 0 ? '-' : terms.length ? '+' : ''}${term}`);
    });
    return terms.join(' ') || '\\mathbf 0';
  }
  function matrixTable(values, pivots = [], headers = true) {
    if (!values.length) return '<p class="quiet">Empty basis.</p>';
    return `<div class="matrix-wrap"><table class="matrix">${headers ? `<thead><tr>${values[0].map((value,index) => `<th class="${pivots.includes(index) ? 'pivot' : ''}">x<sub>${index+1}</sub></th>`).join('')}</tr></thead>` : ''}<tbody>${values.map(row => `<tr>${row.map((value,index) => `<td class="${pivots.includes(index) ? 'pivot' : ''}">${math.format(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function vectorList(values) { return values.length ? `<div class="vector-list">${values.map(vector => formula(column(vector))).join('')}</div>` : formula('\\varnothing'); }

  const questions = [
    { title: 'Four vectors in R3', prompt: 'Find the dimension of their span.', vectors: [[1,0,0],[0,1,0],[0,0,1],[1,1,0]], kind: 'rank' },
    { title: 'Redundant directions', prompt: 'Are these generating vectors independent or dependent?', vectors: [[1,2,0],[2,4,0],[0,1,1]], kind: 'independent' },
    { title: 'Free coefficients', prompt: 'Find the nullity of the matrix with these columns.', vectors: [[1,0,0],[0,1,0],[1,1,0],[2,1,0]], kind: 'nullity' },
    { title: 'Reach the target', prompt: 'Does b = (2, 3, 1) belong to this span?', vectors: [[1,0,0],[0,1,0]], target: [2,3,1], kind: 'membership' },
    { title: 'Beyond the picture', prompt: 'Six standard unit vectors in R6: what is the full dimension, before projection?', vectors: Array.from({length:6},(_,row) => Array.from({length:6},(_,columnIndex) => Number(row === columnIndex))), kind: 'rank' },
    { title: 'The zero subspace', prompt: 'How many vectors belong to a basis of this span?', vectors: [[0,0,0],[0,0,0]], kind: 'rank' }
  ];

  function renderEditors() {
    const dimension = state.dimension;
    element('space-dimension').value = dimension;
    element('vector-count').value = state.count;
    element('input-space').innerHTML = `R<sup>${dimension}</sup>`;
    element('vector-editor').style.setProperty('--dimension', dimension);
    element('vector-editor').innerHTML = `<div class="vector-row coordinate-labels"><span></span>${Array.from({length:dimension},(_,index) => `<span>${index+1}</span>`).join('')}</div>` + vectors().map((vector,row) => `<div class="vector-row" style="--vector-color:${colors[row]}"><span class="vector-name">x<sub>${row+1}</sub></span>${vector.map((value,columnIndex) => `<input type="number" step="any" min="-1000000" max="1000000" value="${value}" data-kind="vector" data-row="${row}" data-column="${columnIndex}" aria-label="Vector ${row+1} coordinate ${columnIndex+1}">`).join('')}</div>`).join('');
    element('coefficient-editor').innerHTML = coefficients().map((value,index) => `<div class="coefficient-row" style="--vector-color:${colors[index]}"><label for="coefficient-${index}">c<sub>${index+1}</sub></label><input type="range" min="${-Math.max(5,Math.abs(value))}" max="${Math.max(5,Math.abs(value))}" step="0.1" value="${value}" data-kind="coefficient" data-index="${index}" aria-label="Coefficient ${index+1} slider"><input id="coefficient-${index}" type="number" step="any" value="${value}" min="-1000000" max="1000000" data-kind="coefficient" data-index="${index}" aria-label="Coefficient ${index+1}"></div>`).join('');
    element('target-editor').innerHTML = state.target.slice(0,dimension).map((value,index) => `<label>b<sub>${index+1}</sub><input type="number" step="any" min="-1000000" max="1000000" value="${value}" data-kind="target" data-index="${index}" aria-label="Target coordinate ${index+1}"></label>`).join('');
    element('transform-editor').innerHTML = `<div class="transform-grid" style="--dimension:${dimension}">${state.transform.slice(0,dimension).map((row,rowIndex) => row.slice(0,dimension).map((value,columnIndex) => `<input type="number" step="any" min="-1000000" max="1000000" value="${value}" data-kind="transform" data-row="${rowIndex}" data-column="${columnIndex}" aria-label="Transformation row ${rowIndex+1} column ${columnIndex+1}">`).join('')).join('')}</div>`;
    for (let index=0;index<3;index++) {
      element(`axis-${index}`).innerHTML = `<option value="-1">None</option>${Array.from({length:dimension},(_,axis) => `<option value="${axis}">${axis+1}</option>`).join('')}`;
      element(`axis-${index}`).value = state.axes[index] === null ? -1 : state.axes[index];
    }
  }

  function renderBasis() {
    const matrix = analysis.matrix.to2DArray();
    reduction = math.reductionSteps(vectors());
    reductionIndex = 0;
    element('analysis-panel').innerHTML = `<h2>Basis, rank &amp; null space</h2><p class="lead">A has the original vectors as columns. Its column space is U, inside R<sup>${state.dimension}</sup>.</p>
      <dl class="metrics"><div class="metric"><dt>Dimension of U</dt><dd>${analysis.rank}</dd></div><div class="metric"><dt>Rank(A)</dt><dd>${analysis.rank}</dd></div><div class="metric"><dt>Nullity(A)</dt><dd>${analysis.nullity}</dd></div><div class="metric"><dt>Columns</dt><dd>${state.count}</dd></div></dl>
      <section class="analysis-section"><div class="matrix-pair"><div><h3>1. Original matrix A</h3>${matrixTable(matrix,analysis.pivots)}</div><div><h3>2. Reduced row echelon form</h3>${matrixTable(analysis.rref,analysis.pivots)}<p class="quiet">Pivot columns: ${analysis.pivots.map(index=>index+1).join(', ') || 'none'}. Free columns: ${analysis.free.map(index=>index+1).join(', ') || 'none'}.</p></div></div><details class="solve-details"><summary>Row operations, step by step</summary><div class="section-heading" style="margin-top:12px"><span id="reduction-count" class="quiet"></span><div class="actions">${iconButton('previous-row-step','Previous row operation','arrow-left')}${iconButton('next-row-step','Next row operation','arrow-right')}</div></div><div id="reduction-step"></div><p class="quiet">Row operations are numerical; nearly dependent data can be sensitive to rounding.</p></details></section>
      <section class="analysis-section"><h3>3. Basis of the column space U</h3>${formula(`\\mathcal B=${analysis.rank ? `\\{${names(analysis.pivots)}\\}` : '\\varnothing'},\\quad \\dim(U)=${analysis.rank}`)}${vectorList(analysis.columnBasis)}<p class="quiet">These are the original pivot columns, not columns from the reduced matrix.</p>${analysis.nullity ? formula(`${combination(analysis.nullBasis[0])}=\\mathbf 0`) + '<p class="quiet">A nonzero coefficient vector gives this dependency.</p>' : formula('Ac=0\\implies c=0') + '<p class="quiet">Only zero coefficients produce zero. The generators are independent.</p>'}</section>
      <section class="analysis-section"><h3>4. Row-space basis in R<sup>${state.count}</sup></h3>${vectorList(analysis.rowBasis)}<p class="quiet">Use the nonzero rows of the reduced matrix.</p></section>
      <section class="analysis-section"><h3>5. Null-space basis in R<sup>${state.count}</sup></h3>${vectorList(analysis.nullBasis)}<p class="quiet">These vectors contain coefficients. Each satisfies A n = 0.</p>${formula(`\\operatorname{rank}(A)+\\operatorname{nullity}(A)=${analysis.rank}+${analysis.nullity}=${state.count}`)}<p class="verification">Rank-nullity verified against the number of columns.</p></section>`;
    renderReduction();
    refreshIcons();
  }

  function renderReduction() {
    const step = reduction[reductionIndex];
    element('reduction-count').textContent = `${reductionIndex === 0 ? 'Original matrix' : 'Operation ' + reductionIndex} / ${reduction.length - 1} operations`;
    element('reduction-step').innerHTML = formula(step.operation) + matrixTable(step.matrix);
    element('previous-row-step').disabled = reductionIndex === 0;
    element('next-row-step').disabled = reductionIndex === reduction.length - 1;
  }

  function renderPractice() {
    element('analysis-panel').innerHTML = `<div class="practice-toolbar"><div><h2>Lecture 3 practice</h2><p class="quiet" style="margin:0">Constructed practice, not predicted exam questions.</p></div><div class="actions"><span id="practice-score" class="quiet"></span><strong id="practice-clock">${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}</strong>${iconButton('practice-timer','Start or pause ten-minute timer','timer')}${iconButton('practice-reset','Reset practice','rotate-ccw')}</div></div><div class="practice-grid">${questions.map((question,index) => {
      const result = math.analyze(question.vectors);
      return `<article class="question"><h3>${index+1}. ${question.title}</h3><p class="prompt">${question.prompt}</p>${matrixTable(result.matrix.to2DArray(),[],true)}<div class="answer-row">${['independent','membership'].includes(question.kind) ? `<select id="answer-${index}" aria-label="Answer ${index+1}"><option value="">Choose</option>${(question.kind==='independent'?['Independent','Dependent']:['Yes','No']).map(value=>`<option>${value}</option>`).join('')}</select>` : `<input id="answer-${index}" type="number" min="0" max="6" step="1" aria-label="Answer ${index+1}">`}<button type="button" class="command primary" data-check="${index}">${icon('check')}Check</button><button type="button" class="command" data-load-question="${index}">${icon('external-link')}Explore</button></div><p id="feedback-${index}" class="feedback" role="status"></p><details><summary>Worked answer</summary><div>${formula(`\\operatorname{rank}(A)=${result.rank},\\quad\\operatorname{nullity}(A)=${result.nullity}`)}${matrixTable(result.rref,result.pivots)}<p class="quiet">${question.kind==='membership' ? (math.solve(result,question.target).consistent?'The target belongs to the span.':'The target has height 1; every vector in this span has height 0.') : `There are ${result.rank} pivot columns. ${result.independent?'Every column has a pivot.':'At least one coefficient is free.'}`}</p></div></details></article>`;
    }).join('')}</div>`;
    for (const [index, answer] of Object.entries(practiceAnswers)) {
      element(`answer-${index}`).value = answer.value;
      element(`feedback-${index}`).textContent = answer.correct ? 'Correct.' : 'Not yet. Check the pivot columns and try again.';
      element(`feedback-${index}`).className = `feedback ${answer.correct?'correct':'incorrect'}`;
    }
    updateScore();
    refreshIcons();
  }

  function updateScore() { if(element('practice-score')) element('practice-score').textContent = `${Object.values(practiceAnswers).filter(answer=>answer.correct).length} / ${questions.length} correct`; }

  function renderChart() {
    if (!chartData || state.plot !== 'coordinates' || ['basis','practice'].includes(state.view)) return;
    if (!globalThis.echarts) { notice('The all-coordinate chart library could not load. The matrix and 3D views remain available.'); return; }
    chart ||= echarts.init(element('coordinate-chart'), null, { renderer: 'canvas' });
    chart.resize();
    const { shownVectors, result } = chartData;
    const extent = Math.max(1, ...shownVectors.flat().map(Math.abs), ...result.map(Math.abs)) * 1.15;
    const series = shownVectors.map((vector,index) => ({name:state.view==='transform'?`T(x${index+1})`:`x${index+1}`,values:vector,color:colors[index]}));
    series.push({name:state.view==='transform'?'T(x)':'x',values:result,color:'#223139'});
    if (state.view==='solve') series.push({name:'b',values:state.target.slice(0,state.dimension),color:'#d54758'});
    if (state.dimension === 1) {
      chart.setOption({animation:false,grid:{left:45,right:20,top:25,bottom:40},tooltip:{trigger:'axis'},xAxis:{type:'category',data:series.map(item=>item.name)},yAxis:{type:'value'},series:[{type:'bar',data:series.map(item=>({value:item.values[0],itemStyle:{color:item.color}}))}]},true);
    } else {
      chart.setOption({animation:false,tooltip:{trigger:'item'},legend:{bottom:3,textStyle:{fontSize:11},itemWidth:16,itemHeight:3},parallel:{left:42,right:30,top:34,bottom:65,parallelAxisDefault:{type:'value',nameLocation:'end',nameTextStyle:{color:'#5c7170',fontSize:10},axisLine:{lineStyle:{color:'#bbc9c6'}},axisLabel:{fontSize:10},splitNumber:3,splitLine:{show:false}}},parallelAxis:Array.from({length:state.dimension},(_,index)=>({dim:index,name:`Coord. ${index+1}`,min:-extent,max:extent})),series:series.map(item=>({type:'parallel',name:item.name,lineStyle:{width:item.name==='x'?3:2,color:item.color,opacity:.85},data:[item.values]}))},true);
    }
  }

  function renderVisual() {
    const original = vectors();
    const transformed = state.view === 'transform';
    const shownVectors = transformed ? math.transform(original,state.transform.slice(0,state.dimension).map(row=>row.slice(0,state.dimension))) : original;
    const full = transformed ? math.analyze(shownVectors) : analysis;
    const result = state.view === 'solve' ? solution.closest : math.combine(shownVectors,coefficients());
    const axes = state.axes.map((axis,index)=>state.plot==='2d' && index===2 ? null : axis);
    const projectedVectors = math.project(shownVectors,axes);
    const projected = math.analyze(projectedVectors);
    const fullCoordinates = state.plot === 'coordinates';
    element('stage').hidden = fullCoordinates;
    element('coordinate-chart').hidden = !fullCoordinates;
    element('plot-tools').hidden = fullCoordinates;
    element('projection-fields').hidden = fullCoordinates;
    element('show-span').closest('label').hidden = fullCoordinates;
    element('basis-only').closest('label').hidden = fullCoordinates;
    element('axis-2').hidden = state.plot==='2d';
    element('rotate').disabled = state.plot!=='3d';
    element('plot-title').innerHTML = `${transformed?'Transformed span':'Span'} in R<sup>${state.dimension}</sup>`;
    element('plot-rank').textContent = `Full dimension ${full.rank}${fullCoordinates?'':` / projected dimension ${projected.rank}`}`;
    element('projection-warning').textContent = !fullCoordinates && projected.rank<full.rank ? 'Some independent directions are hidden by this projection.' : '';
    element('projection-note').textContent = fullCoordinates ? 'Coordinate profiles show every component. Crossing lines do not imply linear dependence.' : `Axes show coordinates ${axes.filter(axis=>axis!==null).map(axis=>axis+1).join(', ') || 'none'}. All algebra uses R${state.dimension}. The span extends beyond the visible grid.`;
    if (scene) {
      scene.setVisible(!fullCoordinates);
      if (!fullCoordinates) scene.update({vectors:projectedVectors,result:math.project([result],axes)[0],target:state.view==='solve'?math.project([state.target.slice(0,state.dimension)],axes)[0]:null,colors,analysis:projected,axisNames:axes.map(axis=>axis===null?'':`coord. ${axis+1}`),names:projectedVectors.map((vector,index)=>transformed?`T(x${index+1})`:`x${index+1}`),planar:state.plot==='2d',showSpan:state.showSpan,resultName:transformed?'T(x)':'x',visible:projectedVectors.map((vector,index)=>!state.basisOnly || full.pivots.includes(index))});
    }
    chartData = { shownVectors, result };
    if (fullCoordinates) renderChart();
    if (state.view==='solve') {
      element('result-band').innerHTML = `<div class="result-title">${solution.kind}</div>${formula(solution.consistent ? `b\\in U,\\quad c_p=${tuple(solution.particular)}` : `b\\notin U,\\quad \\lVert b-Ac_p\\rVert=${math.formatTex(solution.residualNorm)}`)}${formula(`Ac_p=${tuple(solution.closest)}`)}<p class="quiet">${solution.consistent?'The displayed coefficient vector gives the target.':'This is the closest point in the span, not an exact solution.'}</p><details class="solve-details"><summary>General solution &amp; checks</summary>${formula(`\\operatorname{rank}(A)=${analysis.rank},\\quad \\operatorname{rank}([A|b])=${solution.augmentedRank}`)}${solution.consistent?formula(`c=${column(solution.particular)}${analysis.nullBasis.map((vector,index)=>`+t_{${index+1}}${column(vector)}`).join('')}`)+`<p class="quiet">${analysis.nullity?'The parameters are arbitrary real numbers. Each null-space term maps to zero.':'There are no free coefficients.'}</p>`:''}</details>`;
    } else {
      element('result-band').innerHTML = `<div class="result-title">${transformed?'Transformed combination':'Current combination'}</div>${formula(`${transformed?'T(x)':'x'}=${combination(coefficients(),transformed?'T(x)':'x')}`)}${formula(`${transformed?'T(x)':'x'}=${tuple(result)}`)}${transformed?`<p class="quiet">Dimension before T: ${analysis.rank}. Dimension after T: ${full.rank}. Every matrix mapping is linear.</p>`:`<p class="quiet">${analysis.independent?'The generators are independent.':'The generators are dependent.'} ${analysis.spansAmbient?`They span all of R${state.dimension}.`:`They span a ${analysis.rank}-dimensional subspace of R${state.dimension}.`}</p>`}`;
    }
    element('stage').dataset.vector = JSON.stringify(result);
    element('stage').dataset.dimension = full.rank;
    element('stage').dataset.projectedRank = projected.rank;
    element('stage').dataset.generators = JSON.stringify(shownVectors);
  }

  function render(structure = false) {
    analysis = math.analyze(vectors());
    solution = math.solve(analysis,state.target.slice(0,state.dimension));
    if (structure) renderEditors();
    element('workbench').dataset.view = state.view;
    const visual = !['basis','practice'].includes(state.view);
    element('visual-panel').hidden = !visual;
    element('analysis-panel').hidden = visual;
    element('coefficient-section').hidden = ['basis','solve','practice'].includes(state.view);
    element('target-section').hidden = state.view!=='solve';
    element('transform-section').hidden = state.view!=='transform';
    element('workspace-stat').textContent = `${state.count} vectors / ${state.dimension} coordinates each`;
    element('vector-status').innerHTML = `<strong>Rank ${analysis.rank}</strong> / ${analysis.independent?'independent':'dependent'} / nullity ${analysis.nullity}`;
    element('concept-content').innerHTML = `<p>Space R<sup>${state.dimension}</sup> contains all ${state.dimension}-coordinate vectors. A span contains all linear combinations of the given vectors.</p>${formula(`U=\\{Ac:c\\in\\mathbb R^{${state.count}}\\}\\subseteq\\mathbb R^{${state.dimension}}`)}<p><strong>Non-emptiness:</strong> A0 = 0.</p><p><strong>Addition:</strong> x = Aa and y = Ab give x + y = A(a + b).</p><p><strong>Scalar multiplication:</strong> kx = A(ka).</p><p>The coefficient vectors remain real. Thus every span is a subspace, including the zero subspace and the whole space.</p>`;
    document.querySelectorAll('button[data-view]').forEach(button=>{const selected=button.dataset.view===state.view;button.setAttribute('aria-selected',selected);button.tabIndex=selected?0:-1;});
    document.querySelectorAll('button[data-plot]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.plot===state.plot));
    element('show-span').checked = state.showSpan;
    element('basis-only').checked = state.basisOnly;
    element('undo').disabled = !past.length;
    element('redo').disabled = !future.length;
    element('use-solution').disabled = !solution.consistent;
    element('export-image').disabled = !visual;
    if (visual) renderVisual();
    else { scene?.setVisible(false); if(state.view==='basis') renderBasis(); else renderPractice(); }
    persist();
  }

  function loadExample(name) {
    checkpoint();
    const next = defaults();
    if (name==='plane') { next.count=2; next.coefficients=[2,1,0,0,0,0]; }
    if (name==='parallel') { next.count=2; next.vectors[1]=[2,0,0,0,0,0]; }
    if (name==='tilted') { next.count=2; next.vectors[0]=[1,0,1,0,0,0]; next.vectors[1]=[0,1,1,0,0,0]; }
    if (name==='six') { next.dimension=6; next.count=6; next.vectors=math.identity(6); next.coefficients=[1,2,1,-1,0.5,1]; next.plot='coordinates'; }
    if (name==='zero') { next.count=2; next.vectors=Array.from({length:6},()=>Array(6).fill(0)); }
    state=next;
    render(true);
  }

  function download(filename, href) { const link=document.createElement('a');link.download=filename;link.href=href;document.body.append(link);link.click();link.remove(); }

  function setRotation(value) {
    rotating = scene?.rotate(value) || false;
    element('rotate').setAttribute('aria-pressed', rotating);
    element('rotate').setAttribute('aria-label', rotating ? 'Pause rotation' : 'Start rotation');
    element('rotate').title = rotating ? 'Pause rotation' : 'Start rotation';
    element('rotate').innerHTML = icon(rotating ? 'pause' : 'play');
    refreshIcons();
  }

  try {
    math = await globalThis.VectorMathReady;
    state = defaults();
    let restored = false;
    try { const saved=localStorage.getItem(storageKey); if(saved) { state=normalize(JSON.parse(saved)); restored=true; } } catch {}
    const createScene = await scenePromise;
    if (createScene) { try { scene=createScene(element('stage')); } catch {} }
    if (!scene) { state.plot='coordinates'; document.querySelectorAll('button[data-plot]:not([data-plot="coordinates"])').forEach(button=>button.disabled=true); }
    element('example-select').value=restored?'custom':'four';
    render(true);
    notice(scene?'':'WebGL is unavailable. All-coordinate and algebra views are available.');
    app.dataset.ready='true';

    app.addEventListener('input',event=>{
      const input=event.target;
      if(!input.dataset.kind)return;
      const value=input.valueAsNumber;
      const valid=Number.isFinite(value)&&Math.abs(value)<=1e6;
      input.setAttribute('aria-invalid',String(!valid));
      if(!valid){notice('Enter a finite number between -1,000,000 and 1,000,000. The last valid calculation remains displayed.');return;}
      notice('');checkpoint();
      const {kind,row,column:coordinate,index}=input.dataset;
      if(kind==='vector')state.vectors[Number(row)][Number(coordinate)]=value;
      if(kind==='transform'){state.transform[Number(row)][Number(coordinate)]=value;element('transform-preset').value='custom';}
      if(kind==='target')state.target[Number(index)]=value;
      if(kind==='coefficient'){
        state.coefficients[Number(index)]=value;
        document.querySelectorAll(`[data-kind="coefficient"][data-index="${index}"]`).forEach(peer=>{if(peer!==input){if(peer.type==='range'){peer.min=-Math.max(5,Math.abs(value));peer.max=Math.max(5,Math.abs(value));}peer.value=value;}});
      }
      element('example-select').value='custom';render();
    });

    element('space-dimension').addEventListener('change',()=>{checkpoint();state.dimension=Number(element('space-dimension').value);state.axes=[0,1,2].map(axis=>axis<state.dimension?axis:null);element('example-select').value='custom';render(true);});
    element('vector-count').addEventListener('change',()=>{const value=element('vector-count').valueAsNumber;if(!Number.isInteger(value)||value<1||value>6){element('vector-count').setAttribute('aria-invalid','true');notice('Choose one to six generating vectors.');return;}element('vector-count').removeAttribute('aria-invalid');notice('');checkpoint();state.count=value;element('example-select').value='custom';render(true);});
    element('example-select').addEventListener('change',()=>{if(element('example-select').value!=='custom')loadExample(element('example-select').value);});
    app.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button)return;
      if(button.dataset.view){state.view=button.dataset.view;render(true);}
      if(button.dataset.plot){state.plot=button.dataset.plot;setRotation(false);render();}
      if(button.id==='previous-row-step'){reductionIndex=Math.max(0,reductionIndex-1);renderReduction();}
      if(button.id==='next-row-step'){reductionIndex=Math.min(reduction.length-1,reductionIndex+1);renderReduction();}
      if(button.dataset.check!==undefined){
        const index=Number(button.dataset.check),question=questions[index],result=math.analyze(question.vectors),value=element(`answer-${index}`).value;
        if(!value){element(`feedback-${index}`).textContent='Enter an answer first.';return;}
        const expected=question.kind==='independent'?(result.independent?'Independent':'Dependent'):question.kind==='membership'?(math.solve(result,question.target).consistent?'Yes':'No'):String(result[question.kind]);
        const correct=value===expected;practiceAnswers[index]={value,correct};element(`feedback-${index}`).textContent=correct?'Correct.':'Not yet. Check the pivot columns and try again.';element(`feedback-${index}`).className=`feedback ${correct?'correct':'incorrect'}`;updateScore();
      }
      if(button.dataset.loadQuestion!==undefined){const question=questions[Number(button.dataset.loadQuestion)];checkpoint();state=defaults();state.dimension=question.vectors[0].length;state.count=question.vectors.length;question.vectors.forEach((vector,index)=>state.vectors[index]=[...vector,...Array(6-vector.length).fill(0)]);if(question.target){state.target=[...question.target,...Array(6-question.target.length).fill(0)];state.view='solve';}state.axes=[0,1,2].map(axis=>axis<state.dimension?axis:null);if(state.dimension>3)state.plot='coordinates';render(true);}
      if(button.id==='practice-timer'){if(timer){clearInterval(timer);timer=null;button.setAttribute('aria-pressed','false');}else if(seconds>0){button.setAttribute('aria-pressed','true');timer=setInterval(()=>{seconds--;if(element('practice-clock'))element('practice-clock').textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(seconds<=0){clearInterval(timer);timer=null;notice('Practice time is complete. Review your answers.');}},1000);}}
      if(button.id==='practice-reset'){clearInterval(timer);timer=null;seconds=600;Object.keys(practiceAnswers).forEach(key=>delete practiceAnswers[key]);renderPractice();}
    });
    document.querySelector('.tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...document.querySelectorAll('[role=tab]')],current=tabs.indexOf(document.activeElement);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();tabs[next].focus();});
    document.querySelectorAll('[data-axis]').forEach(select=>select.addEventListener('change',()=>{const slot=Number(select.dataset.axis),value=Number(select.value),next=value<0?null:value;const other=next===null?-1:state.axes.findIndex((axis,index)=>index!==slot&&axis===next);if(other>=0)state.axes[other]=state.axes[slot];state.axes[slot]=next;renderEditors();render();}));
    element('show-span').addEventListener('change',()=>{state.showSpan=element('show-span').checked;render();});
    element('basis-only').addEventListener('change',()=>{state.basisOnly=element('basis-only').checked;render();});
    element('transform-preset').addEventListener('change',()=>{const choice=element('transform-preset').value;if(choice==='custom')return;checkpoint();state.transform=math.identity(6);if(choice==='double')state.transform=state.transform.map(row=>row.map(value=>value*2));if(choice==='swap'&&state.dimension>1)[state.transform[0],state.transform[1]]=[state.transform[1],state.transform[0]];if(choice==='project')state.transform[state.dimension-1]=Array(6).fill(0);render(true);});
    element('use-solution').addEventListener('click',()=>{if(!solution.consistent)return;checkpoint();solution.particular.forEach((value,index)=>state.coefficients[index]=value);state.view='explore';render(true);});
    element('undo').addEventListener('click',()=>{if(!past.length)return;future.push(structuredClone(state));state=past.pop();render(true);});
    element('redo').addEventListener('click',()=>{if(!future.length)return;past.push(structuredClone(state));state=future.pop();render(true);});
    element('reset-view').addEventListener('click',()=>{setRotation(false);scene?.reset();});
    element('rotate').addEventListener('click',()=>setRotation(!rotating));
    element('zoom-in').addEventListener('click',()=>scene?.zoom(.85));element('zoom-out').addEventListener('click',()=>scene?.zoom(1.18));
    element('export-workspace').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));download('vector-workspace.json',url);setTimeout(()=>URL.revokeObjectURL(url),1000);});
    element('import-workspace').addEventListener('click',()=>element('import-file').click());
    element('import-file').addEventListener('change',async()=>{const file=element('import-file').files[0];if(!file)return;try{if(file.size>100000)throw new Error('Workspace file is too large.');const next=normalize(JSON.parse(await file.text()));checkpoint();state=next;render(true);notice('');}catch(error){notice(error.message);}element('import-file').value='';});
    element('export-image').addEventListener('click',()=>{const image=state.plot==='coordinates'?chart?.getDataURL({type:'png',pixelRatio:2,backgroundColor:'#f4f7f7'}):scene?.image();if(image)download('vector-space.png',image);});
    new ResizeObserver(()=>{if(state.plot==='coordinates')chart?.resize();}).observe(element('coordinate-chart'));
    globalThis.VectorLab={getState:()=>structuredClone(state),load:input=>{const next=normalize(input);checkpoint();state=next;render(true);},getAnalysis:()=>({rank:analysis.rank,nullity:analysis.nullity,pivots:analysis.pivots,rref:analysis.rref,nullBasis:analysis.nullBasis}),ready:true};
  } catch(error) { notice(`The workspace could not load: ${error.message}. Internet access is required for the pinned libraries.`); console.error(error); }
})();