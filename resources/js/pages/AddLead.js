import React, { Component } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      name: '',
      email: '',
      phone: '',
      address: '',
      progress: 50,
      description: '',
      status: 1,
      earnings: 0.00,
      expenses: 0.00,
      net: 0.00,
      loading: false,
      authUser: props.authUserProp,
      error: false,
      data: [],
    };

    // API endpoint.
    this.api = '/api/v1/addlead';
  }

  componentDidMount() {
    Http.get(`${this.api}?status=open`)
      .then((response) => {
        const { data } = response.data;
        this.setState({
          data,
          error: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Unable to fetch data.',
        });
      });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { todo } = this.state;
    this.addLead(todo);
  };

  addLead = (todo) => {
    Http.post(this.api, { 
      name: this.state.name,
      email: this.state.email, 
      phone: this.state.phone,
      address: this.state.address,
      progress: this.state.progress,
      description: this.state.description,
      status: this.state.status,
      earnings: this.state.earnings,
      expenses: this.state.expenses,
      net: this.state.net
    })
      .then(({ data }) => {
        const newItem = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email, 
          phone: data.data.phone,
          address: data.data.address,
          progress: data.data.progress,
          description: data.data.description,
          status: data.data.status,
          earnings: data.data.earnings,
          expenses: data.data.expenses,
          net: data.data.net,
        };
        const allTodos = [newItem, ...this.state.data];
        this.setState({ data: allTodos});
        this.todoForm.reset();
      })
      .catch(() => {
        
      });
  };

  closeTodo = (e) => {
    const { key } = e.target.dataset;
    const { data: todos } = this.state;

    Http.patch(`${this.api}/${key}`, { status: 'closed' })
      .then(() => {
        const updatedTodos = todos.filter(
          (todo) => todo.id !== parseInt(key, 10),
        );
        this.setState({ data: updatedTodos });
      })
      .catch(() => {
        this.setState({
          error: 'Sorry, there was an error closing your to do.',
        });
      });
  };

  deleteTodo = (e) => {
    const { key } = e.target.dataset;
    const { data: todos } = this.state;
    Http.delete(`${this.api}/${key}`)
      .then((response) => {
        if (response.status === 204) {
          const index = todos.findIndex(
            (todo) => parseInt(todo.id, 10) === parseInt(key, 10),
          );
          const update = [...todos.slice(0, index), ...todos.slice(index + 1)];
          this.setState({ data: update });
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  statusLead = (e) => {
    const { key } = e.target.dataset;
    const { data: todos } = this.state;
    Http.get(`${this.api}/status/${key}`)
        .then(({ data }) => {
          const newItem = {
            id: data.data.id,
            status: data.data.status,
          };
          let allTodos = this.state.data;
          for (const i in allTodos) {
            if(allTodos[i].id == data.data.id){
              allTodos[i].status = data.data.status;
              break;
            }
          }
          this.setState({ data: allTodos});
          this.todoForm.reset();
        })
      .catch((error) => {
        //console.log(error);
      });
  };

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5 ">
        
        <form className="container py-5 new-lead-form border w-50"
          method="post"
          onSubmit={this.handleSubmit}
          ref={(el) => {
            this.todoFormLead = el;
          }}
        >
          
          <input type="hidden" name="api_token"/>
          <div className="form-group">
              <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                  <li className="nav-item">
                      <span className="nav-link btn btn-gradient-primary btn-block active">NEW LEAD</span>
                  </li>
              </ul>
          </div>
          <div className="form-group">
              <label>Name</label>
              <div className="input-group input-group-sm">
                  <input type="text" className="form-control form-control-sm" id="name" name="name" placeholder="Name" 
                  onChange={this.handleChange}/>
              </div>

          </div>
          <div className="form-group">
              <label>Email</label>
              <div className="input-group input-group-sm">
                  <input type="text" className="form-control form-control-sm" id="email" name="email" placeholder="Email" onChange={this.handleChange}/>
              </div>

          </div>
          <div className="form-group">
              <label>Phone</label>
              <div className="input-group input-group-sm">
                  <input type="text" className="form-control form-control-sm" id="phone" name="phone" placeholder="Phone" onChange={this.handleChange}/>
              </div>

          </div>
          <div className="form-group">
              <label>Address</label>
              <div className="input-group input-group-sm">
                  <input type="text" className="form-control form-control-sm" id="address" name="address" placeholder="Address" onChange={this.handleChange}/>
              </div>
          </div>
          <div className="form-group">
              <label>Description</label>
              <div className="input-group input-group-sm">
                  <textarea className="form-control form-control-sm" id="description" name="description" placeholder="Description" onChange={this.handleChange}></textarea>
              </div>
          </div>
          <div className="form-group">
              <hr />
          </div>
          <div className="form-group">
              <label>Progress</label>
              <div className="input-group input-group-sm">
                  <input type="range" min="0" max="100" className="custom-range form-control form-control-sm" id="progress" name="progress" onChange={this.handleChange}/>
              </div>
          </div>
          <div className="form-group">
              <label>Earnings</label>
              <div className="input-group input-group-sm">
                  <input type="number" className="form-control form-control-sm" id="earnings" name="earnings" placeholder="Earnings" onChange={this.handleChange}/>
              </div>
          </div>
          <div className="form-group">
              <label>Expenses</label>
              <div className="input-group input-group-sm">
                  <input type="number" className="form-control form-control-sm" id="expenses" name="expenses" placeholder="Expenses" onChange={this.handleChange}/>
              </div>
          </div>
          <div className="form-group">
              <label>Net</label>
              <div className="input-group input-group-sm">
                  <input type="number" className="form-control form-control-sm" id="net" name="net" placeholder="Net" onChange={this.handleChange}/>
              </div>
          </div>
          <div className="form-group">
              <label>Status</label>
              <div className="input-group input-group-sm">
                  <select className="form-control form-control-sm" id="status" name="status"onChange={this.handleChange} >
                      <option value="1">Active</option>
                      <option value="0" >Inactive</option>
                  </select>
              </div>
          </div>
          <div className="form-group text-center">
              {/* <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Save</button> */}
              <button type="submit" className="btn btn-primary mt-2 p-4">
                  Add Lead
                </button>
          </div>
      </form>

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        <div className="todos">
          <h1 className="text-center mb-4">Lead</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>email</th>
                <th>phone</th>
                <th>address</th>
                <th>expenses</th>
                <th>net</th>
                <th>progress</th>
                <th>status</th>
                <th>action</th>
              </tr>
              {data.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.name}</td>
                  <td>{todo.email}</td>
                  <td>{todo.phone}</td>
                  <td>{todo.address}</td>
                  <td>{todo.expenses}</td>
                  <td>{todo.net}</td>
                  <td>{todo.progress}</td>
                  <td>
                    {todo.status == '1'? 
                                      <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={this.statusLead}
                                        data-key={todo.id}
                                      >
                                        Active
                                      </button>
                    : 
                                      <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={this.statusLead}
                                        data-key={todo.id}
                                      >
                                        DeActive
                                      </button>
                    }
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={this.deleteTodo}
                      data-key={todo.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(Dashboard);
