const setCartCount = (count: string | number) => {
  const icons = document.getElementsByClassName("cart-counter");

  for (const i in icons) {
    if (typeof icons[i] === "object") {
      if (count !== 0 && count !== "0") {
        icons[i].innerHTML = count.toString();
        icons[i].classList.remove("d-none");
      } else {
        icons[i].classList.add("d-none");
      }
    }
  }
};

export default setCartCount;
