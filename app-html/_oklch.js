merge = async (c1, c2) => {
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function hexToOklch(c) {
    hex.value = c;

    hex.dispatchEvent(new Event("change"));

    await sleep(1);

    console.log(oklch.value);

    const s = oklch.value.slice(6, -1).split(" ");

    let [lightness, chroma, hue] = s;

    lightness = Number(lightness.slice(0, -1));
    chroma = Number(chroma);
    hue = Number(hue);

    return [lightness, chroma, hue];
  }

  function average(a, b) {
    return (a + b) / 2;
  }

  const [lightness1, chroma1, hue1] = await hexToOklch(c1);
  console.log(lightness1, chroma1, hue1);
  const [lightness2, chroma2, hue2] = await hexToOklch(c2);
  console.log(lightness2, chroma2, hue2);

  const lightness = average(lightness1, lightness2);
  const chroma = average(chroma1, chroma2);
  const hue = average(hue1, hue2);

  oklch.value = `oklch(${lightness}% ${chroma} ${hue})`;
  console.log(oklch.value);
  oklch.dispatchEvent(new Event("change"));

  await sleep(10);

  console.log(hex.value);
};
