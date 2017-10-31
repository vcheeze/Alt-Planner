# Alt-Planner
## What I did

This is my final project for Mashups. I've created a trip planner using [Teleport API](https://developers.teleport.org/api/getting_started/). When the user searches for a city, my website gives the user an overall city score and breakdown scores of different aspects of the city. I'm currently working on presenting average prices of different items, and I'm still thinking through the best way to visually present them on the page. My website also gives a brief summary concerning the city, as well as top scores from searched cities and top searches as well.

## Why I did it

I originally had the idea to do something related to salaries. Then, when I was trying to plan out upcoming trips for the coming semesters, I thought that it would be really useful if I knew how much certain things would cost on average in certain cities so that I could budget better and be better-informed in my planning about which cities to visit.

## How I did it

I stumbled upon Teleport API. It provides a wealth of information about cities, although it is a bit complicated to play around with. I used D3.js to draw the graphs and present the data visually.

I essentially took the scores and bound them to different sorts of graphs. To do this, I had to decide which graphs or charts best represented the data that I wanted to show. This took some time of thinking, as there were many ways to do this. I read through articles debating the best ways to implement charts and graphs. In the end, I decided to use a radial progress chart for the overall city score, and bar graphs for breakdown scores.

## Resources leveraged

Here are some of the resources that I used for this project:

*   The [GitHub page of D3](https://github.com/d3), to look for changelogs between the different versions of D3 (mainly because Mike Bostock uses version 3 in all of his examples, while the newest version is version 4.) This was tough sometimes as I had to look compare what Mike Bostock had in the version 3 code and convert it to version 4 syntax. All in all, however, they all worked out.

*   Mike Bostock's [Arc Tween](https://bl.ocks.org/mbostock/5100636) in order to create a D3 arc. This example also includes how to update the arc, so that my radial progress chart can be updated with each search.

*   This example of [placing text on an arc](https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html) was also extremely helpful.

*   I tweaked the chart a bit to [round the corners](http://bl.ocks.org/mbostock/b7671cb38efdfa5da3af).

*   To add a tooltip to the bar graph, I used [d3-tip.js](https://github.com/VACLab/d3-tip).

*   I took a look at this article and used its [vertical navigation](https://codyhouse.co/gem/vertical-fixed-navigation/), which is neat for a scrolling website like mine.

*   I looked at several different sites in order to choose color schemes for my pages. The sites included:

    *   [https://designschool.canva.com/blog/100-color-combinations/](https://designschool.canva.com/blog/100-color-combinations/)
    *   [http://blog.visme.co/color-combinations/](http://blog.visme.co/color-combinations/)
    *   [http://line25.com/inspiration/flat-design-color-palettes](http://line25.com/inspiration/flat-design-color-palettes)
    *   [https://digitalsynopsis.com/design/minimal-web-color-palettes-combination-hex-code/](https://digitalsynopsis.com/design/minimal-web-color-palettes-combination-hex-code/)
    *   [https://onextrapixel.com/40-stunning-website-designs-with-great-color-schemes/](https://onextrapixel.com/40-stunning-website-designs-with-great-color-schemes/)
    *   [https://www.awwwards.com/trendy-web-color-palettes-and-material-design-color-schemes-tools.html](https://www.awwwards.com/trendy-web-color-palettes-and-material-design-color-schemes-tools.html)

I continued to use websites like [w3schools](http://www.w3schools.com/) and [the Mozilla Developer Network](https://developer.mozilla.org/en/docs/Web/JavaScript) for some simple syntax problems concerning JavaScript.
