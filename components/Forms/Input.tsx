
export default function Input({label , value , onChange , placeholder = ""}: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-bold">{label}</label>
            <input
             type="text" 
             className="rounded-md border p-3 focus:outline-none"
             value={value}
             placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}