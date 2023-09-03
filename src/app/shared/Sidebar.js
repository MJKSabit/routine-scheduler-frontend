import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';

class Sidebar extends Component {

  state = {};

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({[menuState] : false});
    } else if(Object.keys(this.state).length === 0) {
      this.setState({[menuState] : true});
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({[i]: false});
      });
      this.setState({[menuState] : true});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({[i]: false});
    });

    const dropdownPaths = [
      {path:'/apps', state: 'appsMenuOpen'},
      {path:'/database', state: 'dbUiMenuOpen'},
      {path:'/advanced-ui', state: 'advancedUiMenuOpen'},
      {path:'/theory-schedule', state: 'theoryScheduleMenuOpen'},
      {path:'/tables', state: 'tablesMenuOpen'},
      {path:'/maps', state: 'mapsMenuOpen'},
      {path:'/icons', state: 'iconsMenuOpen'},
      {path:'/charts', state: 'chartsMenuOpen'},
      {path:'/user-pages', state: 'userPagesMenuOpen'},
      {path:'/error-pages', state: 'errorPagesMenuOpen'},
      {path:'/general-pages', state: 'generalPagesMenuOpen'},
      {path:'/ecommerce', state: 'ecommercePagesMenuOpen'},
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({[obj.state] : true})
      }
    }));
 
  }

  render () {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item nav-profile">
            <a href="!#" className="nav-link" onClick={evt =>evt.preventDefault()}>
              <div className="nav-profile-image">
                <img src={ require("../../assets/images/faces/face1.jpg") } alt="profile" />
                <span className="login-status online"></span> {/* change to offline or busy as needed */}
              </div>
              <div className="nav-profile-text">
                <span className="font-weight-bold mb-2">MJKSabit</span>
                <span className="text-secondary text-small">Site Admin</span>
              </div>
              <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
            </a>
          </li>
          <li className={ this.isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-title">Dashboard</span>
              <i className="mdi mdi-home menu-icon"></i>
            </Link>
          </li>
          <li className={ this.isPathActive('/database') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.dbUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('dbUiMenuOpen') } data-toggle="collapse">
              <span className="menu-title">Database</span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-database menu-icon"></i>
            </div>
            <Collapse in={ this.state.dbUiMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/database/teachers') ? 'nav-link active' : 'nav-link' } to="/database/teachers">Teachers</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/database/rooms') ? 'nav-link active' : 'nav-link' } to="/database/rooms">Rooms</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/database/courses') ? 'nav-link active' : 'nav-link' } to="/database/courses">Courses</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/database/sections') ? 'nav-link active' : 'nav-link' } to="/database/sections">Sections</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/theory-assign') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/theory-assign">
              <span className="menu-title">Theory Course Assign</span>
              <i className="mdi mdi-clipboard-check menu-icon"></i>
            </Link>
          </li>
          <li className={ this.isPathActive('/theory-schedule') ? 'nav-item active' : 'nav-item' }>
            <div className={ this.state.theoryScheduleMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('theoryScheduleMenuOpen') } data-toggle="collapse">
              <span className="menu-title">Schedule</span>
              <i className="menu-arrow"></i>
              <i className="mdi mdi-clock-outline menu-icon"></i>
            </div>
            <Collapse in={ this.state.theoryScheduleMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ this.isPathActive('/theory-schedule/fixed') ? 'nav-link active' : 'nav-link' } to="/theory-schedule/fixed">Fixed Schedule</Link></li>
                <li className="nav-item"> <Link className={ this.isPathActive('/theory-schedule/ask') ? 'nav-link active' : 'nav-link' } to="/theory-schedule/ask">Ask for Schedule</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ this.isPathActive('/room-assign') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/room-assign">
              <span className="menu-title">Lab Room Assign</span>
              <i className="mdi mdi-lightbulb-variant-outline menu-icon"></i>
            </Link>
          </li>
          <li className={ this.isPathActive('/lab-assign') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/lab-assign">
              <span className="menu-title">Sessional Assign</span>
              <i className="mdi mdi-format-list-text menu-icon"></i>
            </Link>
          </li>
          <li className={ this.isPathActive('/lab-schedule') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/lab-schedule">
              <span className="menu-title">Sessional Schedule</span>
              <i className="mdi mdi-timer-edit-outline menu-icon"></i>
            </Link>
          </li>
          <li className={ this.isPathActive('/generate-routine') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/generate-routine">
              <span className="menu-title">Generate Routine</span>
              <i className="mdi mdi-file-pdf-box menu-icon"></i>
            </Link>
          </li>
          <li className={ this.isPathActive('/fahad') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/fahad">
              <span className="menu-title">Fahad</span>
              <i className="mdi mdi-bomb menu-icon"></i>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);