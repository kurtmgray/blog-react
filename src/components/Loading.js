import React from "react";
import { ClipLoader } from "react-spinners";
import "./fonts/SyneMono-Regular.ttf";


const Loading = ({ message }) => {
  return (
    <div style={styles.container}>
      <ClipLoader color="#36d7b7" size={50} />
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fdf5e6",
  },
  message: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    color: "#333",
    fontFamily: "Syne Mono, monospace",
  },
};

export default Loading;
