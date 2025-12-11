export const createBlackImage = (): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "black-placeholder.jpg", { type: "image/jpeg" });
          resolve(file);
        } else {
          throw new Error("Failed to create black image");
        }
      },
      "image/jpeg",
      0.9
    );
  });
};

