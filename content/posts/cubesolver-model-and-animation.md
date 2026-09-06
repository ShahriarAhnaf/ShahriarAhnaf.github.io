---
title: "My cube could solve itself. The animation disagreed."
date: "2026-09-06"
description: "Returning to CubeSolver: a compact cube model, a staged solver, and the turn-direction bug that made the renderer drift from the state."
draft: true
---

A Rubik's cube solver has a satisfying definition of done: all the pieces end up where they belong.

Adding a 3D renderer complicates that definition. Now there is the cube the solver changes and the cube the viewer sees. If they disagree about a turn, the solver can make progress while the animation tells a different story.

That mismatch appears in the recent history of [CubeSolver](https://github.com/ShahriarAhnaf/CubeSolver), a C++ project I returned to after a long break. The revival brought together a staged solver, an OpenGL visualizer, and an unusually useful debugging aid: a text drawing of the same cube.

## The cube underneath the graphics

The core represents its faces using six 64-bit integers. Each face packs the eight surrounding sticker positions into byte-sized slots. The layout and access macros are visible in [Cube.h](https://github.com/ShahriarAhnaf/CubeSolver/blob/67796f5a34653f2ea4870553bf978b9a8a89c76e/Core/Inc/Cube.h).

For someone learning bit manipulation, this is a concrete use for shifts and masks. A mask selects the bits for one sticker. A shift brings those bits into a convenient position. Updating a sticker clears that slot and writes the new value into it.

A turn also affects neighboring faces. Rotating the front face means moving its perimeter and the strips of stickers that touch it. A compact representation is useful only if those transfers preserve the meaning of a move.

The model belongs below the display layer. A terminal application and a 3D application should be able to apply the same move to the same core state without maintaining two versions of the cube rules. The project now has a shared `Core` directory for that purpose.

## Solve smaller goals

The recent solver follows a beginner-style progression. It builds the first layers with search and uses a small set of algorithms for the last layer. That implementation was merged in [PR #19](https://github.com/ShahriarAhnaf/CubeSolver/pull/19).

One useful mechanism is a masked target. Instead of asking whether the entire cube is solved, a stage can ask whether a selected set of stickers is correct.

In simplified form, for each face:

```text
(current face AND mask) == (target face AND mask)
```

The mask says which positions matter. Later stages can include previously solved pieces in their target so the search must preserve that progress. The actual comparison is in [Solver.h](https://github.com/ShahriarAhnaf/CubeSolver/blob/67796f5a34653f2ea4870553bf978b9a8a89c76e/Core/Inc/Solver.h).

This gives the solver intermediate answers that a person can inspect. The goal is not just a final move string; each completed stage can be sent to the visualizer while the rest of the solve continues. The merged PR describes a worker thread and stage-by-stage animation.

## When the picture stopped agreeing

One correction in the repository history fixes a direction mismatch between the model's moves and the visualizer's rotations. The animation and cubie tracking were rotating the opposite way to the model. The change negated both rotations and aligned the initial sticker colors with the model. [The correction](https://github.com/ShahriarAhnaf/CubeSolver/commit/7ae227c2b392f9484dc76d42a5b1bf0e7b0523d6).

This is an easy kind of bug to misread. A cube that looks unsolved suggests a solver failure. But the representation on screen may have diverged earlier, one quarter-turn at a time.

The same change added a terminal text net, toggled with `T`. That creates a second view of the state, without depending on the 3D rotation convention. It gives the investigation a useful split: inspect what happened to the model, then inspect how that change was drawn.

A rendering bug can still be a state-tracking bug inside the renderer. Correcting only the visible animation while leaving its cubie bookkeeping reversed would leave the two representations disagreeing after the motion ended.

## An experiment worth trying

The current [README](https://github.com/ShahriarAhnaf/CubeSolver/blob/67796f5a34653f2ea4870553bf978b9a8a89c76e/README.md) describes `M` to scramble, Space to solve, and `T` for the text net.

A useful learning exercise is to start much smaller than a scramble:

1. Apply one face turn and compare the model's text net with the rendered stickers.
2. Apply its inverse and check that both representations return to the start.
3. Apply the same quarter-turn four times and check the same invariant.
4. Only then try a sequence involving several faces.

These are proposed checks for understanding the model, not a claim that a new automated test suite was run for this article. They let you isolate a disagreement before search and animation queues make it harder to follow.

## Keeping the project understandable

The revival uses AI-assisted implementation, which the README and recent changes acknowledge. The explanation still needs to make the state representation, search goals, and rendering conventions inspectable. Those are the parts a future contributor—or future me—will need when a convincing-looking result is wrong.

The solver PR records results from a batch of random scrambles. I would attach a reproducible harness and machine details before presenting those timings as a benchmark here. For this post, the more useful result is structural: the solver has intermediate goals, the display can show them, and there is another way to inspect the underlying state.

## Work record

- **September 2026:** the revived solver and visualizer were merged; a scramble-and-solve demo was added to the README.
- **September 6, 2026:** this draft records the model/renderer direction fix and the staged solving design at commit `67796f5`.
- A useful next entry would document the invariant checks above with saved inputs and results. Keep it in this article so the explanation grows alongside the code.

<!-- Author review: add your own account of why you returned to the project. The draft deliberately avoids inventing a late-night debugging story or claiming new benchmark results. -->
