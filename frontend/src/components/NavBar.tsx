import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useUser } from './UserContext'
import { Link, useNavigate } from 'react-router-dom'

function NavBar() {
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
        <Navbar.Brand as={Link} to='/' className='header'>StoryStash</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/'>Hem</Nav.Link>
            <Nav.Link as={Link} to='/booksearch'>Sök Böcker</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to='/userpage'>Min bokhylla</Nav.Link>
                <Nav className="ms-auto d-flex justify-content-end    align-items-center">
                  <span>Inloggad som {user.username}</span>
                  <Button variant='outline-danger' onClick={whenLogout} className='ms-1'>Logga ut</Button>
                </Nav>
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
