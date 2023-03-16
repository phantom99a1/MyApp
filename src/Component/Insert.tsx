import axios from "axios";
import React from "react";
import Employee from "./Employee";
import moment from "moment";
interface Iprops {
    dataFromSearch:Employee;
    callData:()=>void;
    closeForm:()=>void;
    handleData:Employee;
}

interface Istates{
    emp:Employee
}

class Insert extends React.Component <Iprops,Istates>
{
    Insert(employee:Employee){
        axios.post('https://localhost:44362/api/duatpt_employee/insert', {employee }).then(()=>this.props.callData())
    }

    Update(employee : Employee){
        axios.post('https://localhost:44362/api/duatpt_employee/update',{employee}).then(()=>this.props.callData())
    }
    Detail(employee:Employee){
        axios.post('https://localhost:44362/api/duatpt_employee/detail',{employee})
    }
    render(){
        let item=this.props.dataFromSearch;                
        //let data=this.props.handleData;
        return (
            <div className="col-10">
                <label>ID</label>
                <input className="form-control" type="text" value={item.Employee_ID}  />     
                <label>Tài khoản</label>
                <input className="form-control" type="text" value={item.User_Name} onChange={(e=>{
                    item.User_Name=e.target.value;
                    this.setState({emp:item})
                })}/>
                
                <label>Tên nhân viên</label>
                <input className="form-control" type="text"  value={item.Name} onChange={(e=>{
                    item.Name=e.target.value;
                    this.setState({emp:item})
                })}/>
                <label>Địa chỉ</label>
                <input className="form-control" type="text"  value={item.Address} onChange={(e=>{
                    item.Address=e.target.value;
                    this.setState({emp:item})
                })}/>
                <label>Số điện thoại</label>
                <input className="form-control" type="text" value={item.Phone_Number} onChange={(e=>{
                    item.Phone_Number=e.target.value;
                    this.setState({emp:item})
                })}/>
                <label>Ngày sinh</label>               
                <input className="form-control" type="date" value={moment(item.DOB).format("YYYY-MM-DD")} 
                    onChange={(e=>{
                        item.DOB=new Date(Date.parse(e.target.value));
                        this.setState({emp:item})
                    })}/>
                <label>Giới tính</label>
                {/* Chuyển sang dạng combobox, dữ liệu option lấy từ api (bổ sung api trả về dạng List<KeyValuePair<int, string>>) */}
                <input className="form-control" type="text" value={item.Gender} 
                    onChange={(e=>{
                        //Dùng Gender thôi
                        item.Gender=Number(e.target.value);
                        this.setState({emp:item})
                    })}/>    
            <button style={{width:'100px', marginTop:'20px'}} className="btn btn-primary" type="submit" 
                onClick={()=>{
                    if(item.Employee_ID===undefined)
                        this.Insert(this.state.emp);                                                                       
                    else this.Update(this.state.emp);
                    // Đóng section sau khi lưu(done) 
                    
                    this.props.closeForm();
                }         
            }>Lưu</button>
        </div>            
        )
    }

}


export default Insert;