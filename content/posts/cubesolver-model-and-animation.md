---
title: "I'm bad at solving Rubik's cubes, so I made a solver"
date: "2026-09-06"
description: "A hobby project about turning something I can't do very well into something I can build, understand, and keep improving."
draft: true
---

I'm bad at solving Rubik's cubes. So I wanted to make something that could solve one for me.

Writing a solver is a fairly elaborate response to being bad at a puzzle. But it gives me a reason to get into the parts I enjoy: representing things in code, figuring out how they work, and making something I can actually interact with.

That's where [CubeSolver](https://github.com/ShahriarAhnaf/CubeSolver) comes from. It's a C++ project with an OpenGL cube you can scramble and watch solve itself. It's also an ongoing excuse to learn algorithms and graphics through a problem I can hold in my hands.

## How do you put a cube in a computer?

Before the program can solve anything, it needs a way to describe the cube.

A person sees colors and pieces. The program needs values it can store and operations it can repeat. What does a face look like in memory? When I turn it, which stickers on the neighboring faces move with it? How do I tell whether a move did what I intended?

My implementation uses six 64-bit integers for the faces, with the surrounding stickers packed into byte-sized slots. Shifts and masks let the code read and change those positions. You can see the layout in [Cube.h](https://github.com/ShahriarAhnaf/CubeSolver/blob/67796f5a34653f2ea4870553bf978b9a8a89c76e/Core/Inc/Cube.h).

That gives bit manipulation a purpose. The bits correspond to something visible, and a mistake can put a sticker on the wrong side of the cube.

There is a nice small starting point here for anyone who wants to try a similar project: represent a solved cube, implement one turn, and implement its inverse. Being able to scramble it correctly is already something you have built.

## Teach it a little at a time

Once the moves work, there is the harder question: which moves should the program make?

The recent solver uses a beginner-style progression, building the first layers with search and using a small collection of algorithms for the last layer. The details are in [the solver change](https://github.com/ShahriarAhnaf/CubeSolver/pull/19).

A useful part of that design is being able to describe a partially solved cube. A stage can care about a few positions while leaving others alone. Later stages include the pieces already solved so that the next bit of progress keeps the earlier work intact.

It makes the problem easier to follow. There are intermediate goals to inspect, and each completed stage can become something the visualizer shows.

## I want to see it happen

The visual part matters to me. I want to scramble a cube, ask the solver to deal with it, and watch the moves happen.

The current controls are simple: `M` scrambles, Space solves, and `T` shows a text view of the cube. The [README has a scramble-and-solve demo](https://github.com/ShahriarAhnaf/CubeSolver/blob/67796f5a34653f2ea4870553bf978b9a8a89c76e/README.md).

Getting there involves its own learning. The cube model and the renderer have to agree about what a turn means. The recent work included fixing a rotation-direction mismatch between them. That's one detail along the way; the thing I want at the end is a cube I can play with and a solution I can follow.

## A project I can come back to

I returned to CubeSolver after a long break. The revival includes AI-assisted implementation, which I've noted in the repository. It gives me another way to work through the architecture and bring more of the project to life.

I want this page to grow with it: how I represent the cube, how the solver changes, and what I learn when I try something new. Having the code and an explanation together gives me somewhere to return to, and gives another hobbyist a starting point.

The original reason is still pretty simple. I'm bad at solving cubes, and making a solver sounded fun.

## Work record

- **September 2026:** the revived solver and visualizer were merged, with a scramble-and-solve demo added to the repository.
- **September 6, 2026:** started this account of why I made the project and how it works, based on the implementation at commit `67796f5`.
