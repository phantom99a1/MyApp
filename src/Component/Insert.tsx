import axios from "axios";
import React from "react";
import Employee from "./Employee";
import moment from "moment";
import Gender from "./Gender";
import Employee_Cert from "./Employee_Cert";
interface Iprops {
    callData:()=>void;
    closeForm:()=>void;
    Getgt:any;
    emp_id?: number;
}

interface Istates{
    emp:Employee,
    emp_cert:Employee_Cert,
    emps_cert:Array<Employee_Cert>
    arrDelete:Array<Employee_Cert>
}

class Insert extends React.Component <Iprops,Istates>
{
    constructor (props:Iprops){
        super(props);
        this.state={
            emp:new Employee(),
            emp_cert:new Employee_Cert(),
            emps_cert:[],
            arrDelete:[]
        }
    }
    Insert(employee:Employee,Employees_Cert:Array<Employee_Cert>){
        axios.post('https://localhost:44362/api/duatpt_employee/insert', {employee,Employees_Cert }).then(()=>this.props.callData())
    }

    Update(employee : Employee,Employees_Cert:Array<Employee_Cert>){

        let Employees_Cert_Delete=this.state.arrDelete
        axios.post('https://localhost:44362/api/duatpt_employee/update',{employee,Employees_Cert,Employees_Cert_Delete}).then(()=>this.props.callData())
    }

    Detail(employee:Employee){
        axios.post('https://localhost:44362/api/duatpt_employee/detail',{employee})
        .then(res => this.setState({emp:res.data.Employee, emps_cert:res.data.Employees_Cert}))
    }
   
    componentDidMount(): void {
        let employee = new Employee(); 
        employee.Employee_ID=this.props.emp_id;  
        if(employee.Employee_ID===undefined){     
            this.setState({
                emps_cert:[]
            })
        }
        else    
            this.Detail(employee)
    }
    UNSAFE_componentWillReceiveProps(nextProps: Iprops): void {     
        //Kiểm tra nếu có thay đổi prop thì call api để lấy lại emp tương ứng
        if(nextProps.emp_id===undefined){
            this.setState({
                emp:new Employee(),
                emps_cert:[]
            })
        }
        else{
        if(nextProps.emp_id !== this.props.emp_id){
            let emp=new Employee();
            emp.Employee_ID=nextProps.emp_id;
            this.Detail(emp); 
        }    
    }
    }
    removeItem(itemRemove:Employee_Cert){
        
        let arrRemove=new Array<Employee_Cert>();
        arrRemove=this.state.arrDelete
        if(itemRemove.Cert_ID!==undefined)
            arrRemove.push(itemRemove); 
        
        let arr=new Array<Employee_Cert>();    
        arr=this.state.emps_cert;
        let indexItem=arr.indexOf(itemRemove);
        arr.splice(indexItem,1);       
        
        this.setState({
            emps_cert:arr,
            arrDelete:arrRemove
        });
        
    }
    insertCert(){
        let arr=new Array<Employee_Cert>();
        arr=this.state.emps_cert;
        let item=new Employee_Cert();
        arr.push(item);
        this.setState({emps_cert:arr}, ()=>console.log(this.state.emps_cert));
    }
    render(){    
        let item=this.state.emp;
        let item_cert=this.state.emps_cert;
        return (
            <div className="col-12">                
                    <label>ID</label>
                    <input className="form-control" type="text" value={item.Employee_ID||''}  />     
                    <label>Tài khoản</label>
                    <input className="form-control" type="text" value={item.User_Name||''}
                     onChange={(e=>{
                        item.User_Name=e.target.value;
                        this.setState({emp:item})
                    })}
                    />
                    
                    <label>Tên nhân viên</label>
                    <input className="form-control" type="text"  value={item.Name||''} 
                    onChange={(e=>{
                        item.Name=e.target.value;
                        this.setState({emp:item})
                    })}
                    />
                    <label>Địa chỉ</label>
                    <input className="form-control" type="text"  value={item.Address||''}
                     onChange={(e=>{
                        item.Address=e.target.value;
                        this.setState({emp:item})
                    })}
                    />
                    <label>Số điện thoại</label>
                    <input className="form-control" type="text" value={item.Phone_Number||''}
                     onChange={(e=>{
                        item.Phone_Number=e.target.value;
                        this.setState({emp:item})
                    })}
                    />
                    <label>Ngày sinh</label>               
                    <input className="form-control" type="date" value={moment(item.DOB).format("YYYY-MM-DD")} 
                        onChange={(e=>{
                            item.DOB=new Date(Date.parse(e.target.value));
                            this.setState({emp:item})
                        })}
                        />  
                    <label>Giới tính</label>
                    {/* Chuyển sang dạng combobox, dữ liệu option lấy từ api (bổ sung api trả về dạng List<KeyValuePair<int, string>>) (done) */}
                    <select className="form-control form-control-sm" value={item.Gender||''}
                     onChange={(e)=>{item.Gender=Number(e.target.value)
                        this.setState({emp:item})
                    }}                    
                    >{this.props.Getgt.map((it:Gender)=>{
                        return (<option key={it.Key} value={it.Key}>{it.Value}</option>)
                    })}</select>   

                    {this.state.emps_cert.map((emp_cert:Employee_Cert)=>{
                       return(  <div style={{display:'flex', position:'relative', padding:'10px', margin:'auto', gap:'10px'}}>
                                    <label>Cert_Name</label>
                                    <input  style={{width:'100px'}} 
                                    className="form-control" value={emp_cert.Cert_Name||''} 
                                    onChange={(e)=>{
                                        emp_cert.Cert_Name=e.target.value
                                        this.setState({emp_cert:emp_cert})
                                    }}/>

                                    <label>Cert_Code</label>
                                    <input type="text" className="form-control" value={emp_cert.Cert_Code||''}
                                    onChange={(e)=>{
                                        emp_cert.Cert_Code=e.target.value
                                        this.setState({emp_cert:emp_cert})
                                    }}/> 
                                    <button className="btn btn-danger" onClick={()=>{this.removeItem(emp_cert)}}>Xóa</button>                                   
                                </div>
                       )
                    })}                  
                
                <span style={{margin:'10px'}}>Thêm giấy tờ <button className="btn btn-primary"
                    onClick={()=>{this.insertCert()}}
                    >+</button></span>
            <button style={{display:'flex',width:'100px', marginTop:'20px', justifyContent:'center', alignItems:'center'}} className="btn btn-primary" type="submit" 
                    onClick={()=>{
                        if(this.state.emp.Employee_ID===undefined){
                            if(window.confirm("Bạn muốn thêm bản ghi này chứ?")===true){                               
                                this.Insert(item,item_cert);        
                            }
                        }                                                            
                        else {
                            if(window.confirm("Bạn muốn cập nhật bản ghi này chứ?")===true){
                                this.Update(item,item_cert);
                            }
                                
                        }
                        // Đóng section sau khi lưu(done)
                        this.props.closeForm();
                    }
                }>Lưu</button>
        </div>            
        )
    }

}


export default Insert;