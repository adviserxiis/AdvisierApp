export const convertPercentageColor = (percentage) => {
    const red = Math.min(255, Math.floor((100 - percentage) * 2.55));
    const green = Math.min(255, Math.floor(percentage * 2.55));
    return `rgb(${red}, ${green}, 0)`;
  };