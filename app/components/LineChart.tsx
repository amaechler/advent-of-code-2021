import React from "react";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { line } from "d3-shape";
import { easeLinear } from "d3-ease";
import "d3-transition";

import { LTTB } from "downsample";

export interface Dimensions {
    width: number;
    height: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

const defaultChartDimensions: Dimensions = {
    width: 600,
    height: 300,
    margin: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    }
};

export interface LineChartProps {
    enableAnimation?: boolean;
    items: {
        x: number;
        y: number;
    }[];
    dimensions?: Dimensions;
}

export const LineChart = ({ enableAnimation = false, dimensions = defaultChartDimensions, items }: LineChartProps) => {
    const svgRef = React.useRef(null);

    const { width, height, margin } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const sampledItems = React.useMemo(
        () =>
            (
                LTTB(
                    items.map(x => [x.x, x.y]),
                    50
                ) as unknown as number[][]
            ).map(p => ({ x: p[0], y: p[1] })),
        [items]
    );

    React.useEffect(() => {
        const xScale = scaleLinear()
            .domain(extent(sampledItems, d => d.x) as [number, number])
            .nice()
            .range([0, width]);

        const yScale = scaleLinear()
            .domain(extent(sampledItems, d => d.y) as [number, number])
            .nice()
            .range([0, height]);

        // create root container where we will append all other chart elements
        const svgEl = select(svgRef.current);
        svgEl.selectAll("*").remove(); // clear svg content before adding new elements
        const svg = svgEl.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

        // add X grid lines with labels
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(axisBottom(xScale))
            .call(g => g.select(".domain").remove())

            .call(g => g.selectAll(".tick line").clone().attr("y2", -height).attr("stroke-opacity", 0.1));

        // add Y grid lines with labels
        svg.append("g")
            .call(axisLeft(yScale))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone().attr("x2", width).attr("stroke-opacity", 0.1));

        // draw the lines
        const d3Line = line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]));

        const lines = svg
            .selectAll(".line")
            .data(sampledItems)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3Line(sampledItems.map(l => [l.x, l.y])) as any);

        if (enableAnimation) {
            lines.each((d, i, nodes) => {
                const element = nodes[i];
                const length = element.getTotalLength();

                select(element)
                    .attr("stroke-dasharray", `${length},${length}`)
                    .attr("stroke-dashoffset", length)
                    .transition()
                    .duration(750)
                    .ease(easeLinear)
                    .attr("stroke-dashoffset", 0);
            });
        }
    }, []);

    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default LineChart;
