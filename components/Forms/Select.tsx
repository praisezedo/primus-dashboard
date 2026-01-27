
export default function Select({label , value , onChange , options , placeholder}: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-bold">{label}</label>
            <select 
             value={value}
             onChange={(e) => onChange(e.target.value)}
             className="rounded-md border p-3 focus:outline-none"
            >
                <option>{placeholder}</option>
                {options.map((opt: string) => (
                 <option value={opt} key={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}