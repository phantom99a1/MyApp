import React from "react";
import Child from "./Child";
interface Iprops{

}
interface Istates{
    user:User,
    count:number
}
class User{
    ID?:number;
    Name?:string;
}
class Parent extends React.Component<Iprops,Istates>{

    constructor(props:any){
        super(props);        
        this.state={
           user :new User(),
           count:0
        }


    }
     SetCount =() =>{
        this.setState({count:this.state.count+1})
    }
    render(){
       let item=this.state.user!;
        return (
            <div style={{border:'solid 2px red'}}> 
                <h1>Component Cha</h1>
                <input type="text" id="ID" onChange={(e)=>{
                    item.ID=Number(e.target.value)
                    this.setState({user:item})
                }}/>
                <input type="text" id="name" onChange={(e)=>{
                    item.Name=e.target.value;
                    this.setState({user:item})
                }
                }/>
                <button onClick={()=>this.SetCount()}>Cộng</button>
                <button onClick={()=>this.setState({count:0})}>Reset</button>
                <p>Giá trị của count là: {this.state.count}</p>
                <div>
                    <Child dataFromParent={this.state.user} callMethod={this.SetCount}/>
                    
                </div>
                
            </div>
           
        )
    }

}
export default Parent;