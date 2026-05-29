import { useState } from 'react';

export interface PotFormData {
  title: string;
  description: string;
  place: string;
  meetingTime: string;
  maxPeople: number;
}

interface Props {
  initialData?: Partial<PotFormData>;
  onSubmit: (data: PotFormData) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

export default function PotForm({ initialData, onSubmit, submitLabel = '생성', loading }: Props) {
  const [form, setForm] = useState<PotFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    place: initialData?.place ?? '',
    meetingTime: initialData?.meetingTime ?? '',
    maxPeople: initialData?.maxPeople ?? 1,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PotFormData, string>>>({});

  const validate = (): boolean => {
    const e: Partial<Record<keyof PotFormData, string>> = {};
    if (!form.title || form.title.length < 2) e.title = '제목은 2자 이상이어야 합니다.';
    if (!form.description || form.description.length < 10) e.description = '설명은 10자 이상이어야 합니다.';
    if (!form.place) e.place = '장소를 입력하세요.';
    if (!form.meetingTime || new Date(form.meetingTime) < new Date()) e.meetingTime = '날짜는 현재 이후여야 합니다.';
    if (form.maxPeople < 1) e.maxPeople = '최대 인원은 1명 이상이어야 합니다.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const handleChange = (field: keyof PotFormData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="pot-form">
      <div className="form-group">
        <label>제목</label>
        <input
          value={form.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="팟 제목 (2자 이상)"
        />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label>설명</label>
        <textarea
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder="팟 설명 (10자 이상)"
          rows={4}
        />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label>장소</label>
        <input
          value={form.place}
          onChange={e => handleChange('place', e.target.value)}
          placeholder="만날 장소"
        />
        {errors.place && <p className="field-error">{errors.place}</p>}
      </div>

      <div className="form-group">
        <label>날짜/시간</label>
        <input
          type="datetime-local"
          value={form.meetingTime}
          onChange={e => handleChange('meetingTime', e.target.value)}
        />
        {errors.meetingTime && <p className="field-error">{errors.meetingTime}</p>}
      </div>

      <div className="form-group">
        <label>최대 인원</label>
        <input
          type="number"
          value={form.maxPeople}
          min={1}
          onChange={e => handleChange('maxPeople', Number(e.target.value))}
        />
        {errors.maxPeople && <p className="field-error">{errors.maxPeople}</p>}
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? '처리 중...' : submitLabel}
      </button>
    </form>
  );
}