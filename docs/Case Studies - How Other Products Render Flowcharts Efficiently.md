### Introduction
Making apps for the web requires we be efficient with the usage of resources. Rendering a flowchart through brute force is not a difficult task, but many methods can be used to cut down on compute time. This allows for clients to not be bogged down by a single instance of a complex flowchart. While discovering these methods for oneself may be a fun challenge, doing so is not an efficient way to make a product quickly. Instead, using our curiosity to dissect other examples of efficient flowcharts and then adding our own improvements is a better way to advance the field.

### Lucid Chart
#### Canvas vs Sequential UI
In the article [1](https://www.lucidchart.com/techblog/2023/08/25/design-for-canvas-based-applications/), John defines a UI design paradigm called *Canvas UI*. This paradigm has many facets which complement the core mechanic, a canvas. The `<canvas/>` tag is one that in my opinion is easy to start using, but hard to master. Having only what parts are absolutely necessary be rendered on the canvas is important. Canvas updates occur on the CPU, but incur the same compute cost of GPU calculations. The parts that need not be part of the canvas are instead overlayed on top. In the case of LucidChart, Shapes, Contextual UI, Fixed UI, and Modal UI are layers atop the canvas. The layer I think is most notable is shapes, not having shapes on the canvas is something important for efficiency gains.

In contrast to Canvas UI, he also defines *Sequential UI* which is the old style Microsoft ribbon UI. This is where multiple button clicks are required to achieve an action, unless a key bind is setup. This type of UI is definitely not one we want to replicate for our project, but mostly due to UX reasons.

#### Occlusion and Contextual Rendering
An almost obvious efficiency gain laid out in [2](https://www.lucidchart.com/techblog/2015/05/19/big-content-in-a-little-canvas/) is not rendering objects that are outside the active area of the canvas. Being careful with the implementation of occlusion is important to ensure no objects pop into existence. For example, here's how a subpar implementation could lead to such issues.

![[Pasted image 20231222174911.png|400]]
As you can see in this (crude) example, the element inside the active area (green) is should be rendered. The element that cannot be seen (red) should not.

However, things might be complicated by connecting lines...

![[Pasted image 20231222175237.png|400]]
In this example, a line is connecting a occluded element and one that is not. The line should obviously be rendered in its entirety. However, if the line were to be naively implemented, it could be occluded if just one parent element is. To fix this, using boolean OR logic is necessary.

### Split Rendering
Another interesting method [2](https://www.lucidchart.com/techblog/2015/05/19/big-content-in-a-little-canvas/) points out is using multiple canvas objects. This is genius when paired with occlusion, but using this optimization requires it. Without occlusion, once the amount of lines reaches a large amount, the amount of pixels being rendered by canvas elements will be too large to be handled. With occlusion, however, a relatively constant amount of lines can be used.

But, even more constant, is having a single canvas with the size being the client's viewport. The downside is because multiple lines exist, some orchestration is required such that no line rendering causes another to become incorrect. But once a good central algorithm to render lines is created, the amount of pixels being rendered on the CPU is constant.

The thing is, the amount of pixel is not the only factor. Currently, my *orchestration algorithm* is just delete the old frame and redraw from scratch every time the state becomes invalid. This is obviously inefficient. Allowing old frame data to be reused and just drawing changes would obviously be better. Doing so is where my implementation could see improvement.

### [Draw IO](https://app.diagrams.net)
In complete opposition to the way I am currently doing things, Draw IO uses SVGs to render all elements. The genius behind this is using a custom API to translate canvas' API into SVG manipulations.

Instead of explaining why Draw IO is more efficient, I want to explore how it functions.

#### Components
In React, we have components. Draw IO is made with just base HTML, CSS, and JS; the developers behind it reinvented the component system to fit their needs. While their code is firmly in the days of ECMAScript 6, the OOP approach is interesting. The main functions that are overridden to create components are `paintVertexShape(c: Canvas, x: number, y: number, w: number, h: number)` and `redrawPath(c: Canvas, x: number, y: number, w: number, h: number)`. Ignoring the esoteric naming, at least one of these functions is overridden in each of the final components. `redrawPath` controls the position of vertices, while `paintVertexShape` applies color.

```javascript
// snippet from src/main/mxgraph/shape/mxCloud.js
/**
 * Function: redrawPath
 *
 * Draws the path for this shape.
 */
mxCloud.prototype.redrawPath = function(c, x, y, w, h)
{
	c.moveTo(0.25 * w, 0.25 * h);
	c.curveTo(0.05 * w, 0.25 * h, 0, 0.5 * h, 0.16 * w, 0.55 * h);
	c.curveTo(0, 0.66 * h, 0.18 * w, 0.9 * h, 0.31 * w, 0.8 * h);
	c.curveTo(0.4 * w, h, 0.7 * w, h, 0.8 * w, 0.8 * h);
	c.curveTo(w, 0.8 * h, w, 0.6 * h, 0.875 * w, 0.5 * h);
	c.curveTo(w, 0.3 * h, 0.8 * w, 0.1 * h, 0.625 * w, 0.2 * h);
	c.curveTo(0.5 * w, 0.05 * h, 0.3 * w, 0.05 * h, 0.25 * w, 0.25 * h);
	c.close();
};
```

```javascript
// snippet from src/main/mxgraph/shape/mxCylinder.js
/**
 * Function: paintVertexShape
 * 
 * Redirects to redrawPath for subclasses to work.
 */
mxCylinder.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.begin();
	this.redrawPath(c, x, y, w, h, false);
	c.fillAndStroke();
	
	if (!this.outline || this.style == null || mxUtils.getValue(
		this.style, mxConstants.STYLE_BACKGROUND_OUTLINE, 0) == 0)
	{
		c.setShadow(false);
		c.begin();
		this.redrawPath(c, x, y, w, h, true);
		c.stroke();
	}
};
```

#### Orchestration
So how are multiple components put on the grid? While each component itself is a SVG, the components are also rendered based on their location. So rather than the CSS controlling their location through a transformation, the SVG is offset by the position of the component. This leads to a fairly simple way to have multiple components, just have an array of components with their positions and sizes! Invalidating the state can occur using a reducer pattern. While there are many efficiency gains that the Draw IO developers have obviously taken advantage of, even the naive implementation is probably extremely fast due to not relying on CPU-GPU communication. 
### References
1. [Lucid Chart - Design for Canvas Based Applications](https://www.lucidchart.com/techblog/2023/08/25/design-for-canvas-based-applications/)
2. [Lucid Chart - Big Content In a Little Canvas](https://www.lucidchart.com/techblog/2015/05/19/big-content-in-a-little-canvas/)