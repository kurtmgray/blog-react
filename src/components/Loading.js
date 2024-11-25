import React from "react";
import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import "./fonts/SyneMono-Regular.ttf";


const Loading = ({ isLoading }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = ["Loading", "Loading.", "Loading..", "Loading..."];
  
    useEffect(() => {
      if (isLoading) {
        const interval = setInterval(() => {
          setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 1000);
  
        return () => clearInterval(interval); 
      }
    }, [isLoading, messages.length]);
  return (
    <div style={styles.container}>
      <ClipLoader color="#36d7b7" size={50} />
      <p style={styles.message}>{messages[messageIndex]}</p>
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
    alignText: "left",
    marginTop: "1rem",
    width: "116px",
    fontSize: "1.2rem",
    color: "#333",
    fontFamily: "Syne Mono, monospace",
  },
};

export default Loading;
