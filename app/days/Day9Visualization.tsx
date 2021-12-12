import React from "react";
import { select } from "d3-selection";
import { interpolateHcl, quantize } from "d3-interpolate";

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
    width: 1000,
    height: 600,
    margin: {
        top: 30,
        right: 100,
        bottom: 30,
        left: 100
    }
};

const colors = quantize(interpolateHcl("#fafa6e", "#2A4858"), 10);

/**
 * Visualizes day 9 input as surface plot.
 * 
 * This 3d surface plot uses d3 / SVG only, and does not memoize
 * any calculations. The SVG implementation for a larger matrix is
 * simply too slow for interactions. It would be nice to try a 
 * rendering with WebGL next.
 */
export const Day9Visualization = ({ matrix }: { matrix: number[][] }): JSX.Element => {
    const [yaw, setYaw] = React.useState<number>(0.5);
    const [pitch, setPitch] = React.useState<number>(0.5);
    const [zoom, setZoom] = React.useState<number>(1);

    const svgRef = React.useRef(null);

    const { width, height, margin } = defaultChartDimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    React.useEffect(() => {
        const svgEl = select(svgRef.current);
        svgEl.selectAll("*").remove(); // clear svg content before adding new elements
        const svg = svgEl.append("g").data([matrix]);

        const originalData = svg.datum();

        const heightFunction = (value: number) => value * 5;
        const heights = calculateHeights(originalData, heightFunction);
        const rotationMatrix = calculateRotationMatrix(yaw, pitch);

        // project data points
        const projectedData = projectDataPoints(originalData, rotationMatrix, width, heights, zoom);

        // create SVG paths
        const svgPaths = createSvgPaths(projectedData, originalData, width, height);

        // let d3 draw paths and colors
        const dr = svg
            .selectAll("path")
            .data(svgPaths)
            .enter()
            .append("path")
            .attr("d", (d: { path: string }) => {
                // console.log(d);
                return d.path;
            });

        dr.attr("fill", (d: { data: number; depth: number }): string | null => colors[d.data]);

        // update zoom based on wheel events
        svg.on("wheel", (event: WheelEvent) => {
            event.preventDefault();
            event.stopPropagation();

            setZoom(z => z - event.deltaY / 10000);
        });

        // update yaw and pitch based on mouse movement

        let drag = false;
        svg.on("mousedown", () => {
            drag = true;
        });

        svg.on("mouseup", () => {
            drag = false;
        });

        svg.on("mousemove", (event: MouseEvent) => {
            if (drag) {
                setYaw(y => y - event.movementX / 50);
                setPitch(p => {
                    const pitch = p + event.movementY / 50;
                    return Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
                });
            }
        });
    }, [yaw, pitch, zoom]);

    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

type HeightFunction = (value: number, x: number, y: number) => number;
type Point3D = { x: number; y: number; z: number };

function calculateRotationMatrix(yaw: number, pitch: number): number[] {
    const cosA = Math.cos(pitch);
    const sinA = Math.sin(pitch);
    const cosB = Math.cos(yaw);
    const sinB = Math.sin(yaw);

    return [cosB, 0, sinB, sinA * sinB, cosA, -sinA * cosB, -sinB * cosA, sinA, cosA * cosB];
}

function calculateHeights(datum: number[][], heightFunction: HeightFunction): number[][] {
    const output = [];
    for (let x = 0; x < datum.length; x++) {
        const t: number[] = [];
        for (let y = 0; y < datum[0].length; y++) {
            const value = heightFunction(datum[x][y], x, y);
            t.push(value);
        }
        output.push(t);
    }

    return output;
}

function createSvgPaths(projectedData: Point3D[][], originalData: number[][], width: number, height: number) {
    const svgPaths = [];

    for (let x = 0; x < projectedData.length - 1; x++) {
        for (let y = 0; y < projectedData[0].length - 1; y++) {
            // svgPaths.push({
            svgPaths[x * (projectedData.length - 1) + y] = {
                // SVG path
                path:
                    "M" +
                    (projectedData[x][y].x + width / 2).toFixed(10) +
                    "," +
                    (projectedData[x][y].y + height / 2).toFixed(10) +
                    "L" +
                    (projectedData[x + 1][y].x + width / 2).toFixed(10) +
                    "," +
                    (projectedData[x + 1][y].y + height / 2).toFixed(10) +
                    "L" +
                    (projectedData[x + 1][y + 1].x + width / 2).toFixed(10) +
                    "," +
                    (projectedData[x + 1][y + 1].y + height / 2).toFixed(10) +
                    "L" +
                    (projectedData[x][y + 1].x + width / 2).toFixed(10) +
                    "," +
                    (projectedData[x][y + 1].y + height / 2).toFixed(10) +
                    "Z",
                depth:
                    projectedData[x][y].z +
                    projectedData[x + 1][y].z +
                    projectedData[x + 1][y + 1].z +
                    projectedData[x][y + 1].z,
                data: originalData[x][y]
            };
        }
    }

    return svgPaths;
}

function projectDataPoints(
    originalData: number[][],
    rotationMatrix: number[],
    width: number,
    heights: number[][],
    zoom: number
): Point3D[][] {
    const projectPoint = (point: Point3D): Point3D => ({
        x: rotationMatrix[0] * point.x + rotationMatrix[1] * point.y + rotationMatrix[2] * point.z,
        y: rotationMatrix[3] * point.x + rotationMatrix[4] * point.y + rotationMatrix[5] * point.z,
        z: rotationMatrix[6] * point.x + rotationMatrix[7] * point.y + rotationMatrix[8] * point.z
    });

    const projectedData = [];
    for (let x = 0; x < originalData.length; x++) {
        const t: Point3D[] = [];
        for (let y = 0; y < originalData[0].length; y++) {
            t.push(
                projectPoint({
                    x: ((x - originalData.length / 2) / (originalData.length * 1.41)) * width * zoom,
                    y: heights[x][y] * zoom,
                    z: ((y - originalData[0].length / 2) / (originalData[0].length * 1.41)) * width * zoom
                })
            );
        }
        projectedData.push(t);
    }

    return projectedData;
}
