import "./styles.scss";
import { chart } from "./chart";
import { data } from "./data";
import { deleteLast, onSubmit, resetMyChart } from "./utils";

const myChart = chart(document.getElementById("chart"), data);
myChart.init();

const formRef = document.querySelector(".form");
const deleteBtn = document.querySelector(".deleteBtn");
const resetBtn = document.querySelector(".resetBtn");
formRef.addEventListener("submit", (event) => onSubmit(event, data, myChart));
deleteBtn.addEventListener("click", () => deleteLast(data, myChart));
resetBtn.addEventListener("click", () => resetMyChart(data, myChart));
