import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function App() {
    const [insights, setInsights] = useState([]);
    const svgRef = useRef();

    useEffect(() => {
        fetch('/api/insights')
            .then(response => response.json())
            .then(data => setInsights(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (insights.length > 0) {
            drawChart();
        }
    }, [insights]);

    const drawChart = () => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous drawings

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        svg.attr('width', width).attr('height', height);

        const intensityCounts = d3.rollup(
            insights,
            v => v.length,
            d => d.intensity
        );

        const data = Array.from(intensityCounts, ([intensity, count]) => ({ intensity, count }));

        const x = d3.scaleBand()
            .domain(data.map(d => d.intensity))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.intensity))
            .attr('y', d => y(d.count))
            .attr('height', d => y(0) - y(d.count))
            .attr('width', x.bandwidth())
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', 'orange');
                // Optionally, show a tooltip
            })
            .on('mouseout', function(event, d) {
                d3.select(this).attr('fill', 'steelblue');
            });
    };

    return (
        <div className="App">
            <h1>Insights Dashboard</h1>
            <svg ref={svgRef}></svg>
            <div>
                <h2>Insights Summary</h2>
                <ul>
                    {insights.map(insight => (
                        <li key={insight.id}>
                            <a href={insight.url} target="_blank" rel="noopener noreferrer">{insight.title}</a> - {insight.insight}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
