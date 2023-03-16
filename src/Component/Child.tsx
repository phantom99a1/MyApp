import React from "react";
interface Iprops{
    dataFromParent:any ;    
    callMethod:any;
}
interface Istates{

}

class Child extends React.Component<Iprops,Istates>{

    // constructor(props: Iprops)
    // {
    //     super(props);
    // }

    render(){
        return (
            <div>
                <h1>Component Con</h1>
                <h1>Giá trị state Component cha</h1>
                <ul>
                    <li >{this.props.dataFromParent.ID}</li>
                    <li>{this.props.dataFromParent.Name}</li>
                </ul>

                <button onClick={()=>this.props.callMethod()}>Cộng cho cha</button>
            </div>
        )
    }

}
export default Child;