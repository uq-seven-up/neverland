import React from "react"

interface QRCodeWidgetProp {id?:string}

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
		<section id={this.props.id} className="widget qrcode">        				
            <img src={`/client-screen/gfx/${imageName}`} alt=""/>			
        </section>
        )
    }
}

export default QRCodeWidget