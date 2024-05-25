import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useUser } from './UserContext'
import { Link, useNavigate } from 'react-router-dom'

const NavBar: React.FC = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const whenLogout = () => {
    logout()
    alert('Du är utloggad nu. Vi ses snart igen!')
    navigate('/')
  }

  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand as={Link} to='/'>StoryStash</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/'>Hem</Nav.Link>
            <Nav.Link as={Link} to='/booksearch'>Sök Böcker</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to='/userpage'>Min bokhylla</Nav.Link>
                <Nav.Item className='ms-auto'>
                  <span>Inloggad som {user.username}</span>
                </Nav.Item>
                <Button variant='outline-danger' onClick={whenLogout} className='ms-2'>Logga ut</Button>
              </>
            ) : (
              <Nav.Link as={Link} to='/login'>Logga in</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar

// const Navbar: React.FC = () => {
//   const { user, logout } = useUser()

//   return (
//     <nav>
//       <ul>
//         <li><Link to="/booksearch">Sök Böcker</Link></li>
//         {user ? (
//           <>
//             <li><Link to="/userpage">Min bokhylla</Link></li>
//             <li>Inloggad som {user.username}</li>
//             <li><button onClick={logout}>Logga ut</button></li>
//           </>
//         ) : (
//           <li><Link to="/login"></Link></li>
//         )}
//       </ul>
//     </nav>
//   )

// }
// export default Navbar
