import React, { useState } from 'react';
import { Timetable, Syllabus } from './StudentPages';

export const Academics = () => {

  const [tab, setTab] = useState('timetable');

  return (
    <div>

      <div className="tabs">

        <button
          className={tab === 'timetable' ? 'active' : ''}
          onClick={() => setTab('timetable')}
        >
          Timetable
        </button>

        <button
          className={tab === 'syllabus' ? 'active' : ''}
          onClick={() => setTab('syllabus')}
        >
          Syllabus
        </button>

      </div>

      {tab === 'timetable' && <Timetable />}
      {tab === 'syllabus' && <Syllabus />}

    </div>
  );
};