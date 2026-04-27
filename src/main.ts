import { portfolioData } from "./data/portfolioData";
import { createPortfolioMarkup } from "./ui/sections";
import "./styles/global.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Unable to mount Aethergrid: #app was not found.");
}

app.innerHTML = createPortfolioMarkup(portfolioData);
