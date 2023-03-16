import React from "react";
import Insert from "./Insert";
import 'bootstrap/dist/css/bootstrap.min.css';
import Employee from "./Employee";
import axios from "axios";
import moment from "moment";
//import { format } from "path";
interface Istates {
    Filter?: Employee;
    Employee?: Employee;
    Employees?: Array<Employee>;
    statusInsert?:boolean;
}
interface Iprops {
}

class Search extends React.Component<Iprops, Istates> {

    constructor(props: Iprops) {
        super(props);
        
        this.state = {
            Filter: new Employee(),
            Employee: new Employee(),
            Employees: [],
            statusInsert:false,
        }
    }
    toggle = () => this.setState({statusInsert: true});
    closeToggle=()=>this.setState({statusInsert:false})
    Delete(Employee: Employee) {
        axios.post('https://localhost:44362/api/duatpt_employee/delete', { Employee }).then(() => this.loadData())
    }

    handleSubmit = (e: any): void => {
        e.preventDefault();
        this.loadData();
    }

    private loadData(){
        const Filter  = this.state.Filter;
        axios.post('https://localhost:44362/api/duatpt_employee/search', {Filter} ).then((res) => {
            this.setState({ Employees: res.data.Employees })
            }
        )
    }

    render() {
        let item = this.state.Filter!;
        return (
            <div>
                <div style={{ width: '100%', height: "80px", border: '2px solid none', display: 'flex', backgroundColor: 'white', alignItems: 'center', justifyContent:'space-around' }}>                 
                        <h2>Quản lý nhân viên</h2>                                   
                        <button className="btn btn-primary" type="button"
                            onClick={()=>{this.toggle();
                            this.setState({
                                Employee:new Employee()
                            })}}
                            >Tạo mới</button>
                   
                </div>
                <div className="container-fluid" >
                    <div className="row" >
                        <div className="col-8" style={{ border: '2px solid black', float: 'left'}}>
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>                                
                                    <form >
                                        <label>
                                            Tài khoản:</label>
                                        <input className="form-control" value={item.User_Name||''} style={{ fontSize: '16', width:'400px' }} type="text" onChange={(e) => {
                                            item.User_Name = e.target.value;                                            
                                            this.setState({Filter: item})
                                        }} />
                                        <br/>                                        
                                        <label>Tên nhân viên:</label>
                                        <input className="form-control" type="text" value={item.Name||''} style={{ fontSize: '16', width:'400px' }} onChange={(e) => {
                                            item.Name = e.target.value;
                                            this.setState({
                                                Filter: item
                                            })
                                        }} />                                   
                                        <br/>
                                    </form>
                                        <div>
                                        <button className="btn btn-warning" type="submit"  onClick={this.handleSubmit}>Tìm</button>&nbsp;                            
                                        <button className="btn btn-secondary" onClick={() =>
                                            this.setState({
                                                Filter: {
                                                    User_Name: '',
                                                    Name: ''
                                                },
                                               Employees:[],
                                               statusInsert:false,
                                               Employee:new Employee()                                                                                   
                                            })
                                        }>Reset</button>
                                        <br/>
                                        <br/>
                                        </div>
                                
                            </div>
                            <div>
                                <table className="table table-bordered" style={{ textAlign: 'center' }}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>ID</th>
                                            <th>Tài khoản</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Số điện thoại</th>
                                            <th>Giới tính</th>
                                            <th>Ngày sinh</th>
                                            <th>Xử lý</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            this.state.Employees?.map((item: Employee, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td >{item.Employee_ID}</td>
                                                        <td>{item.User_Name}</td>
                                                        <td>{item.Name}</td>
                                                        <td>{item.Address}</td>
                                                        <td>{item.Phone_Number}</td>
                                                        <td>{item.Gender}</td>
                                                        {/* Chuyển dùng DOB -> format về dạng dd/MM/yyyy (moment) (done)*/}
                                                        <td>{moment(item.DOB).format("DD/MM/yyyy")}</td> 
                                                        <td className="col-2"> 
                                                        <button className="btn btn-primary" onClick={() => {
                                                                this.toggle();                                                                                                                          
                                                                this.setState({ Employee: item })
                                                                }
                                                            }
                                                            >Sửa </button>&nbsp;                                                             
                                                            <button className="btn btn-danger" onClick={() => {
                                                                if(window.confirm('Bạn có muốn xóa bản ghi này không')===true)                                                               
                                                                    this.Delete(item)                                                                                                                           
                                                            }}>Xóa </button>                                                                                                                  
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-4" style={{ border: '2px solid black', display:'flex', flexDirection:'column', alignItems:'center'}}>
                           {/* Đẩy emp_id vào component Insert, Component Insert sẽ call api detail để lấy thông tin hiển thị */}
                           {this.state.statusInsert && <Insert dataFromSearch={this.state.Employee!} callData={()=>this.loadData()}
                            closeForm={()=>this.closeToggle()}  handleData={this.state.Employee!}/>}
                        </div>
            </div>
            </div>
            </div>
        )
    }
}
export default Search;