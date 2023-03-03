 import React from 'react'
 import appstore from "../../../images/Appstore.png"
 import playstore from "../../../images/playstore.png"
 import "./Footer.css"
 const Footer = () => {
   return (
    <footer id="footer">
    <div className="leftFooter">
    <h4>DOWNLOAD OUR APP</h4>
    <p>Download App for Android and ISO mobile phone</p>
    <img src={playstore} alt={"playstore"} />
    <img src={appstore} alt={"appstore"} />
    </div>
    <div className="midFooter">
    <h1>ECOMMERCE.</h1>
    <p>High Quality is our first priority</p>
    <p>Copyrights 2022 &copy; MeSiddhant</p>
    </div>
    <div className="rightFooter">
    <h4>Follow us</h4>   
    <a href='https://www.instagram.com/'>Instagram</a> 
    </div>
    </footer>
     
   )
 }
 
 export default Footer