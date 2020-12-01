import React from "react";
import logoImage from "../../images/logo.jpg"


const Logo = () => {
    return (
        <header className="container">
            <img className="img-fluid" src={logoImage} alt="non-figurative background image"/>
        </header>
    )
}

export default Logo