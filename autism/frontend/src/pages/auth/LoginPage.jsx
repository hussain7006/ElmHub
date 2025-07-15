import useAuthStore from '../../store/authStore';
import Header from '../../Componentss/Auth/_component/Header';
import LoginForm from '../../Componentss/Auth/Login/_component/LoginForm';
import LoginInfo from '../../Componentss/Auth/Login/_component/LoginInfo';
const LoginPage = () => {
  const { theme } = useAuthStore();

  // const [formData, setFormData] = useState({
  //   email: 'parent1@example.com',
  //   password: 'parent123',
  //   role: 'parent'
  // });
  // const [formData, setFormData] = useState({
  //   email: 'child1@example.com',
  //   password: 'child123',
  //   // role: 'child'
  // });
  // const [formData, setFormData] = useState({
  //   email: 'specialist1@example.com',
  //   password: 'specialist123',
  //   role: 'specialist'
  // });

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* <Header /> */}
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <LoginForm />
        <LoginInfo />
      </div>
    </div>
  );
};

export default LoginPage; 