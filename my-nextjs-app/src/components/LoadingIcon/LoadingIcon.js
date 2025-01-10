"use client";
import React from "react";
import Image from "next/image";
import LoadingIcon from "@/assets/images/loading-icon.gif"; 
import styles from './loadingIcon.module.css'; 

const LoadingIconComponent = () => {
  return (
    <div className={styles['loading-container']}> 
      <Image
        className={styles['loading-icon']}  
        src={LoadingIcon}
        alt="Loading..."
        width={100} 
        height={100} 
        priority 
      />
    </div>
  );
};

export default LoadingIconComponent;
