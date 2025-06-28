import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ selectedDate, setSelectedDate }) {
  return (
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
    />
  );
}
