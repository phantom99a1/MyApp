import React from "react";
import Insert from "./Insert";
import 'bootstrap/dist/css/bootstrap.min.css';
import Employee from "./Employee";
import ResultEmployeeSearch from "./ResultEmployeeSearch";
import EmployeeDTO from "./EmployeeDTO";
import axios from "axios";
import moment from "moment";
import Gender from "./Gender";
import Employee_Cert from "./Employee_Cert";
import styles from './pagination.module.scss';
import classNames from 'classnames';
interface Istates {
    Filter?: Employee;
    Employee?: Employee;
    ResultEmployees?: Array<ResultEmployeeSearch>;
    statusInsert?:boolean;
    GioiTinh?:Array<Gender>;
    SelectData?:Array<Employee>;
    EmployeeDTO?:EmployeeDTO;
    Pagination? : boolean;
    Employees_Cert?:Array<Employee_Cert>;
    Employee_Cert?:Employee_Cert;
    //pageSize
    pageSize:number;
    //pageIndex
    currentPage?:number;
    //totalPage
    totalPage?: number;
    checkBox:boolean;
   
}
interface Iprops {
}

class Search extends React.Component<Iprops, Istates> {

    constructor(props: Iprops) {
        super(props);
        
        this.state = {
            Filter: new Employee(),
            Employee: new Employee(),
            ResultEmployees: [],
            statusInsert:false,
            GioiTinh:[],
            SelectData:[],
            pageSize: 4,
            currentPage:0,
            Pagination :false,
            Employees_Cert:[],
            Employee_Cert:new Employee_Cert(),
            checkBox:false

        }
    }
    getGender(){
        axios.post('https://localhost:44362/api/duatpt_employee/getgender')
        .then(res => {
            this.setState({GioiTinh:res.data.Gender})}
        );
    }
    toggle = () => this.setState({statusInsert: true});
    closeToggle(){this.setState({statusInsert:false})}
    Delete(Employee: Employee) {
        axios.post('https://localhost:44362/api/duatpt_employee/delete', { Employee })
        .then(() => this.loadData())
    }

    DeleteAll(Employees:Array<Employee>){
        axios.post('https://localhost:44362/api/duatpt_employee/deleteall',{Employees})
        .then(()=>this.loadData())
    }

    handleSubmit = (e: any): void => {
        e.preventDefault();        
        this.setState({
            Pagination:true,
            currentPage:0,
        },()=>this.loadData())
    }
    componentDidMount(): void {
        this.getGender();
    }

    private loadData(){
        const Filter  = this.state.Filter;        
        let pageIndex  = this.state.currentPage;        
        let pageSize  = this.state.pageSize;        
        axios.post('https://localhost:44362/api/duatpt_employee/search', {Filter,pageIndex,pageSize} )
            .then((res) => {
                this.setState({ 
                    ResultEmployees: res.data.ResultEmployees,
                    checkBox:false   
                })
                this.caculateTotalPage(pageSize, res.data.TotalRecords);
        })
    }

    caculateTotalPage(pageSize: number, totalRecords: number)
    {
        let totalPage = Math.ceil(totalRecords / pageSize);
        this.setState({
            totalPage: totalPage
        })
    }

    handleDelete(e:any, Employee:Employee):void{
        if(e.target.checked){            
            this.setState({
                SelectData:[...this.state.SelectData!,Employee]
            }   )            
        }   
        else {
            this.setState({
                SelectData:this.state.SelectData?.filter(m=> m !== Employee)
            })
        }           
    }

    pagination(pageNumber:number):Array<number>{
        let arr=new Array<number>();
        for(let i=1;i<=pageNumber;i++)
            arr.push(i);
        return arr;
    }
    render() {
        let item = this.state.Filter!;
        let empdata=this.state.SelectData!;
        let pageStep=3;
        return (
            <div>
                <div style={{ width: '100%', height: "80px", border: '2px solid none', display: 'flex', backgroundColor: 'yellow', alignItems: 'center', justifyContent:'space-around' }}>                 
                    <h2>Quản lý nhân viên</h2>
                    <div>                                   
                        <button className="btn btn-primary" type="button"
                            onClick={()=>{
                               
                                this.setState({
                                    Employee:new Employee(),
                                    Employees_Cert:[],
                                    Employee_Cert:new Employee_Cert()                                        
                                },()=> this.toggle())                                                                                                                           
                                }
                            }>Tạo mới</button>&nbsp;
                        {/* Xóa nhiều bản ghi  (done)*/}
                        {!this.state.checkBox && <button className="btn btn-danger" onClick={
                            ()=>{this.setState({
                                checkBox:true
                            })                               
                            }}>Xóa nhiều bản ghi</button> }

                           {this.state.checkBox && <button
                           className="btn btn-danger m-5"
                           onClick={()=>{
                            if(window.confirm("Bạn muốn xóa những bản ghi này chứ?")===true){
                               this.DeleteAll(empdata)}                                                                     
                       }}>Xóa</button>} 
                       
                    </div>                  
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
                                               ResultEmployees:[],
                                               statusInsert:false,
                                               Employee:new Employee(),
                                               currentPage:0,                                           
                                               Pagination:false, 
                                               pageSize:4,
                                               checkBox:false                                                                                                                                                                                                               
                                            })
                                        }>Reset</button>
                                        <br/>
                                        <br/>
                                        </div>
                                
                            </div>
                            <div >
                                <table className="table table-bordered" style={{ textAlign: 'center' }}>
                                    <thead>
                                        <tr>
                                            {this.state.checkBox && <th>#</th>}
                                            <th>ID</th>
                                            <th>Tài khoản</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Số điện thoại</th>
                                            <th>Giới tính</th>
                                            <th>Ngày sinh</th>
                                            <th>Giấy tờ</th>
                                            <th>Xử lý</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {                                       
                                            this.state.ResultEmployees?.map((item: ResultEmployeeSearch, index) => {                                                
                                                let gt= this.state.GioiTinh?.find( m => m.Key===item.Gender)?.Value;                                                
                                                return (
                                                    <tr key={index}>
                                                       {this.state.checkBox && <td >
                                                            <input 
                                                        type="checkbox"
                                                         className="form-check-input" 
                                                         defaultChecked={false}
                                                         onChange={(e)=>this.handleDelete(e,item)}/></td> }

                                                        <td >{item.Employee_ID}</td>
                                                        <td>{item.User_Name}</td>
                                                        <td>{item.Name}</td>
                                                        <td>{item.Address}</td>
                                                        <td>{item.Phone_Number}</td>
                                                        <td>{gt}</td>
                                                        {/* Chuyển dùng DOB -> format về dạng dd/MM/yyyy (moment) (done)*/}
                                                        <td>{moment(item.DOB).format("DD/MM/yyyy")}</td>
                                                        <td>{item.Certificate}</td> 
                                                        <td className="col-2"> 
                                                        <button className="btn btn-primary" onClick={() => {                                                            
                                                                this.toggle();                                                                                                                          
                                                                this.setState({ Employee:item})                                                                
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

                            {/* phân trang */}

                            { this.state.Pagination &&
                            <div className="form-group col" style={{display:'flex', gap:"200px"}}>
                            <select className="form-control form-control-sm" defaultValue={4}
                                style={{width:'50px', height:'70%'}}
                             onChange={(e)=>{                               
                               this.setState({
                                currentPage:0,
                                pageSize:Number(e.target.value)          
                            },()=>this.loadData())                             
                            }}
                            >
                                <option value="2">2</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={7}>7</option>
                                <option value={10}>10</option>
                            </select>   
                            <div style={{ display:'flex', width:'80%', height:'70%', justifyContent:'center'}}>
                                {/* về trang 1 */}
                                <button className={classNames([styles.pageItem, styles.sides].join(' '))}
                                disabled={this.state.currentPage===0} 
                                onClick={()=>this.setState({
                                    currentPage:0
                                },()=>this.loadData())}>&lt;
                                </button>
                            {this.state.totalPage!>0 && 
                            <div>
                                {/* trang 1 */}
                                <button className={classNames(styles.pageItem,
                                 {[styles.active]: this.state.currentPage === 0,})}
                                onClick={()=>this.setState({
                                    currentPage:0
                                },()=>this.loadData())}>{1}
                                </button>
                                {/* Nhảy về 3 trang */}
                                {this.state.currentPage!>pageStep-1 && 
                                <button style={{color:'black', outline:'none',border:'none', backgroundColor:'transparent'}}
                                    onClick={()=>this.setState({
                                        currentPage:this.state.currentPage!-pageStep
                                    },()=>this.loadData())}>
                                    {"..."}                                    
                                </button>
                                }
                                {this.state.currentPage === this.state.totalPage!-1 &&this.state.totalPage!>pageStep && (
                                <button className={styles.pageItem}
                                    onClick={()=>this.setState({
                                        currentPage:this.state.currentPage!-pageStep+1
                                    },()=>this.loadData())}>
                                        {this.state.currentPage!-pageStep+2}
                                </button>)
                                }
                                {this.state.currentPage! >pageStep-2 && (
                                <button className={styles.pageItem}
                                onClick={()=>this.setState({
                                    currentPage:this.state.currentPage!-pageStep+2
                                },()=>this.loadData())}>
                                    {this.state.currentPage!-pageStep+3}
                                </button>)}
                                {this.state.currentPage! !==0 && this.state.currentPage! !==this.state.totalPage!-1&&(
                                    <button className={[styles.pageItem, styles.active].join(' ')}
                                    onClick={()=>this.setState({
                                        currentPage:this.state.currentPage! 
                                    },()=>this.loadData())}>
                                        {this.state.currentPage!+1}
                                    </button>
                                )}
                                {this.state.currentPage! <this.state.totalPage! -pageStep+1&& (
                                    <button className={styles.pageItem}
                                    onClick={()=>this.setState({
                                        currentPage: this.state.currentPage!+pageStep-2
                                    },()=>this.loadData())}>
                                        {this.state.currentPage!+pageStep-1}
                                    </button>
                                )}
                                {this.state.currentPage! ===0 && this.state.totalPage!>pageStep &&(
                                    <button className={styles.pageItem}
                                    onClick={()=>this.setState({
                                        currentPage: this.state.currentPage!+pageStep-1
                                    },()=>this.loadData())}>
                                        {this.state.currentPage!+pageStep}
                                    </button>
                                )}
                                {this.state.currentPage! < this.state.totalPage! -pageStep &&(
                                    <button style={{color:'black', outline:'none',border:'none', backgroundColor:'transparent'}}
                                     onClick={()=>this.setState({
                                        currentPage: this.state.currentPage!+pageStep
                                    },()=>this.loadData())}>
                                        {"..."}
                                    </button>
                                )}                               
                                {/* Trang cuối */}
                                <button className={classNames(styles.pageItem,
                                 {[styles.active]: this.state.currentPage === this.state.totalPage!-1,})}
                                onClick={()=>this.setState({
                                    currentPage: this.state.totalPage!-1 
                                },()=>this.loadData())}>
                                    {this.state.totalPage! }
                                </button>                                
                            </div>
                            }                           
                            <button className={classNames([styles.pageItem, styles.sides].join(' '))}
                            disabled={this.state.currentPage===this.state.totalPage! - 1}
                            onClick={()=>this.setState({
                                currentPage:this.state.totalPage!-1
                            },()=>this.loadData())}
                            >&gt;</button>
                            </div>

                            <div style={{marginRight:'20px'}}>
                                Page {this.state.currentPage! + 1}/{this.state.totalPage!}
                            </div>                            
                            </div>}
                        </div>
                        <div className="col-4" style={{ border: '2px solid black', display:'flex', flexDirection:'column', alignItems:'center', padding:'10px'}}>
                           {/* Đẩy emp_id vào component Insert, Component Insert sẽ call api detail để lấy thông tin hiển thị  (done)*/}
                           {this.state.statusInsert && <Insert  
                                emp_id={this.state.Employee?.Employee_ID}
                                callData={()=>this.loadData()}                               
                                closeForm={()=>this.closeToggle()} 
                                Getgt={this.state.GioiTinh!}/>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Search;