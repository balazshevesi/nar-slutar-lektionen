const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
export default sleep;
