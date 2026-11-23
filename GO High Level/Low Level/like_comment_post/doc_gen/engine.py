"""Tiny ASCII diagram engine: box grid, arrows only between neighbouring columns, crossing check.

diagram(nodes, edges, ...)  -> str   (flow / quick-view diagrams)
data_row(groups)            -> str   (double-line schema + example boxes, side by side)
"""

L, R, U, D = 1, 2, 4, 8
JOIN = {L | R: '─', L: '─', R: '─', U | D: '│', U: '│', D: '│',
        R | D: '┌', L | D: '┐', R | U: '└', L | U: '┘',
        R | U | D: '├', L | U | D: '┤', L | R | D: '┬', L | R | U: '┴', L | R | U | D: '┼'}


def box_lines(title, lines, w, badge=None):
    inner = w - 2
    for t in [title, *lines]:
        assert len(t) <= inner - 2, f'too long for box ({len(t)} > {inner - 2}): {t!r}'
    top = '┌' + (f'── {badge} ' if badge else '')
    top = top + '─' * (w - 1 - len(top)) + '┐'
    out = [top, '│ ' + title.ljust(inner - 1) + '│', '├' + '─' * inner + '┤']
    out += ['│ ' + t.ljust(inner - 1) + '│' for t in lines]
    out.append('└' + '─' * inner + '┘')
    return out


def diagram(nodes, edges, box_w, gaps, arrow_off, band_gap=4, trunk_off=6,
            frame=None, headings=None, top_pad=0):
    """nodes: {id: dict(col, band, title, lines, badge?)}; edges: [(src, dst)] with dst.col == src.col + 1.
    gaps: list of gap widths between columns. frame: dict(title, from_col, gap_off) draws a double-line
    frame around columns >= from_col. headings: {col: text} written on the top line."""
    ncols = max(n['col'] for n in nodes.values()) + 1
    xs = [0]
    for c in range(1, ncols):
        xs.append(xs[-1] + box_w + gaps[c - 1])
    rendered = {k: box_lines(n['title'], n['lines'], box_w, n.get('badge')) for k, n in nodes.items()}
    nbands = max(n['band'] for n in nodes.values()) + 1
    band_h = [max((len(rendered[k]) for k, n in nodes.items() if n['band'] == b), default=0) for b in range(nbands)]
    y0 = top_pad
    band_y = []
    for b in range(nbands):
        band_y.append(y0)
        y0 += band_h[b] + band_gap
    bottom = y0 - band_gap

    grid = {}
    bits = {}
    for k, n in nodes.items():
        x, y = xs[n['col']], band_y[n['band']]
        n['x'], n['y'] = x, y
        for i, line in enumerate(rendered[k]):
            for j, ch in enumerate(line):
                grid[(y + i, x + j)] = ch

    def add(y, x, m):
        assert (y, x) not in grid, f'line runs into a box at {(y, x)}'
        bits[(y, x)] = bits.get((y, x), 0) | m

    def hline(y, xa, xb):
        for x in range(xa, xb + 1):
            add(y, x, (L if x > xa else 0) | (R if x < xb else 0) or (L | R))

    def vline(x, ya, yb):
        lo, hi = min(ya, yb), max(ya, yb)
        for y in range(lo, hi + 1):
            add(y, x, (U if y > lo else 0) | (D if y < hi else 0))

    heads = []
    for c in range(ncols - 1):
        es = [(a, b) for a, b in edges if nodes[a]['col'] == c]
        for a, b in es:
            assert nodes[b]['col'] == c + 1, f'edge {a}->{b} skips a column'
        if not es:
            continue
        gx = xs[c] + box_w
        glen = gaps[c]
        tx = gx + trunk_off
        # crossing check: connected groups in this gap must not overlap vertically
        groups = []
        for a, b in es:
            ys, yd = nodes[a]['y'] + arrow_off, nodes[b]['y'] + arrow_off
            hit = [g for g in groups if a in g['n'] or b in g['n']]
            g = {'n': {a, b}, 'lo': min(ys, yd), 'hi': max(ys, yd), 'bent': ys != yd}
            for h in hit:
                groups.remove(h)
                g = {'n': g['n'] | h['n'], 'lo': min(g['lo'], h['lo']), 'hi': max(g['hi'], h['hi']),
                     'bent': g['bent'] or h['bent']}
            groups.append(g)
        for g1 in groups:
            for g2 in groups:
                if g1 is not g2 and g1['bent'] and not (g1['hi'] < g2['lo'] or g2['hi'] < g1['lo']):
                    raise AssertionError(f'lines would cross in gap {c}: {g1["n"]} / {g2["n"]}')
        for a, b in es:
            ys, yd = nodes[a]['y'] + arrow_off, nodes[b]['y'] + arrow_off
            end = gx + glen - 3
            if ys == yd:
                hline(ys, gx + 1, end)
            else:
                hline(ys, gx + 1, tx)
                vline(tx, ys, yd)
                hline(yd, tx, end)
            heads.append((yd, gx + glen - 2))

    for (y, x), m in bits.items():
        grid[(y, x)] = JOIN[m]
    for y, x in heads:
        grid[(y, x)] = '>'

    if frame:
        fx = xs[frame['from_col'] - 1] + box_w + frame['gap_off']
        rx = max(n['x'] for n in nodes.values()) + box_w + 3
        fy0, fy1 = top_pad - 2, bottom + 1
        title = f'══ {frame["title"]} '
        line = '╔' + title + '═' * (rx - fx - 1 - len(title)) + '╗'
        for j, ch in enumerate(line):
            grid[(fy0, fx + j)] = ch
        grid[(fy1, fx)] = '╚'
        for x in range(fx + 1, rx):
            grid[(fy1, x)] = '═'
        grid[(fy1, rx)] = '╝'
        for y in range(fy0 + 1, fy1):
            for x in (fx, rx):
                grid[(y, x)] = '╫' if grid.get((y, x)) == '─' else '║'
    if headings:
        hy = top_pad - 2 if frame else 0
        for c, text in headings.items():
            for j, ch in enumerate(text):
                grid[(hy, xs[c] + j)] = ch

    maxy = max(y for y, _ in grid)
    maxx = max(x for _, x in grid)
    out = []
    for y in range(min(y for y, _ in grid), maxy + 1):
        out.append(''.join(grid.get((y, x), ' ') for x in range(maxx + 1)).rstrip())
    return '\n'.join(out)


def data_box(title, lines):
    w = max(len(title), *(len(t) for t in lines)) + 2
    out = ['╔' + '═' * w + '╗', '║ ' + title.ljust(w - 1) + '║', '╟' + '─' * w + '╢']
    out += ['║ ' + t.ljust(w - 1) + '║' for t in lines]
    out.append('╚' + '═' * w + '╝')
    return out


def data_row(groups, sep=4):
    """groups: [(label or None, [(title, text_block), ...])] -> boxes side by side, '▼ label' over each group."""
    cols, labels = [], []
    x = 0
    for label, boxes in groups:
        if label:
            labels.append((x, '▼ ' + label))
        for title, text in boxes:
            b = data_box(title, text.strip('\n').split('\n'))
            cols.append((x, b))
            x += len(b[0]) + sep
    h = max(len(b) for _, b in cols)
    rows = [[' '] * x for _ in range(h + (1 if labels else 0))]
    off = 1 if labels else 0
    for lx, t in labels:
        rows[0][lx:lx + len(t)] = list(t)
    for cx, b in cols:
        for i, line in enumerate(b):
            rows[i + off][cx:cx + len(line)] = list(line)
    return '\n'.join(''.join(r).rstrip() for r in rows)
