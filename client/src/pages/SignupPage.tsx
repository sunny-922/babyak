import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/authApi';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', passwordConfirm: '',
    nickname: '', studentNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.username.length < 4) e.username = '아이디는 4자 이상이어야 합니다.';
    if (form.password.length < 8) e.password = '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (form.nickname.length < 2) e.nickname = '닉네임은 2자 이상이어야 합니다.';
    if (!form.studentNumber) e.studentNumber = '학번를 입력하세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup({
        username: form.username, password: form.password,
        nickname: form.nickname, studentNumber: form.studentNumber,
      });
      alert('회원가입 성공! 로그인해 주세요.');
      navigate('/login');
    } catch (e: any) {
      setErrors({ form: e.message });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'username', label: '아이디', placeholder: '4자 이상', type: 'text' },
    { key: 'password', label: '비밀번호', placeholder: '8자 이상', type: 'password' },
    { key: 'passwordConfirm', label: '비밀번호 확인', placeholder: '비밀번호 재입력', type: 'password' },
    { key: 'nickname', label: '닉네임', placeholder: '2자 이상', type: 'text' },
    { key: 'studentNumber', label: '학번', placeholder: '학번 입력', type: 'text' },
  ] as const;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(({ key, label, placeholder, type }) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={placeholder}
              />
              {errors[key] && <p className="field-error">{errors[key]}</p>}
            </div>
          ))}
          {errors.form && <p className="error-text">{errors.form}</p>}
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="auth-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}