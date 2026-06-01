import { readFileSync } from "node:fs";

const pipelinePath = "examples/fullstack-app-template/pipeline.json";
const pipeline = JSON.parse(readFileSync(pipelinePath, "utf8"));

const failures = [];
const nodeIds = new Set();

if (!pipeline.version) failures.push("Pipeline must include version.");
if (!pipeline.name) failures.push("Pipeline must include name.");
if (!Array.isArray(pipeline.nodes)) failures.push("Pipeline nodes must be an array.");
if (!Array.isArray(pipeline.edges)) failures.push("Pipeline edges must be an array.");

for (const node of pipeline.nodes ?? []) {
  if (!node.id) failures.push("Every node must include id.");
  if (!node.type) failures.push(`Node ${node.id ?? "(unknown)"} must include type.`);
  if (!node.label) failures.push(`Node ${node.id ?? "(unknown)"} must include label.`);
  if (nodeIds.has(node.id)) failures.push(`Duplicate node id: ${node.id}`);
  nodeIds.add(node.id);
}

for (const edge of pipeline.edges ?? []) {
  if (!edge.id) failures.push("Every edge must include id.");
  if (!nodeIds.has(edge.source)) failures.push(`Edge ${edge.id} has unknown source: ${edge.source}`);
  if (!nodeIds.has(edge.target)) failures.push(`Edge ${edge.id} has unknown target: ${edge.target}`);
}

if (failures.length > 0) {
  console.error("Example validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Example validation passed: ${pipelinePath}`);
