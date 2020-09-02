import React from "react"

interface QRCodeWidgetProp {}

interface QRCodeWidgetState {}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class QRCodeWidget extends React.Component<QRCodeWidgetProp, QRCodeWidgetState> {    
    /* ########################################################*/
    /* UI Rendering*/
    public render() {
		let imageName = process.env.NODE_ENV === 'development' ? 'development-mobile-qr.png' : 'production-mobile-qr.png'		
		return (
		<section className="widget qrcode">
        	<div className="heading">
				<h2>Scan to Interact</h2>
				<figure></figure>
			</div>
			<div className="content">
            	<img src={`/client-screen/gfx/${imageName}`} alt=""></img>
			</div>
        </section>
        )
    }
}

export default QRCodeWidget