import React, { useState } from 'react';
import axios from 'axios';

function CreateJob() {
  const token = localStorage.getItem('tpToken');

  const [formData, setFormData] = useState({
    jobtitle: '',
    company: '',
    jobdesc: '',
    location: '',
    salary: '',
    requiredSkills: '',
    minimumCGPA: '',
    eligibleBranches: [],
    deadline: '',
    jobStatus: 'open'
  });

  const branches = ['CSE', 'ECE', 'IS']; // predefined branches

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for eligibleBranches
    if (name === 'eligibleBranches') {
      const branch = value;
      const updated = formData.eligibleBranches.includes(branch)
        ? formData.eligibleBranches.filter(b => b !== branch)
        : [...formData.eligibleBranches, branch];
      setFormData({ ...formData, eligibleBranches: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submitJob = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/tp/jobs', {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim())
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Job created successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Job creation failed:', error);
      alert('Error creating job');
    }
  };

  return (
    <div className='text-white p-6'>
      <h2 className='text-2xl mb-4'>Create New Job</h2>
      <form onSubmit={submitJob} className='space-y-4'>

        <input name='jobtitle' value={formData.jobtitle} onChange={handleChange} placeholder='Job Title' className='w-full p-2 rounded text-black' required />
        <input name='company' value={formData.company} onChange={handleChange} placeholder='Company Name' className='w-full p-2 rounded text-black' required />
        <textarea name='jobdesc' value={formData.jobdesc} onChange={handleChange} placeholder='Job Description' className='w-full p-2 rounded text-black' required />
        <input name='location' value={formData.location} onChange={handleChange} placeholder='Location' className='w-full p-2 rounded text-black' />
        <input name='salary' value={formData.salary} onChange={handleChange} placeholder='Salary' className='w-full p-2 rounded text-black' />
        <input name='requiredSkills' value={formData.requiredSkills} onChange={handleChange} placeholder='Required Skills (comma-separated)' className='w-full p-2 rounded text-black' />
        <input type='number' name='minimumCGPA' value={formData.minimumCGPA} onChange={handleChange} placeholder='Minimum CGPA' className='w-full p-2 rounded text-black' />
        <input type='date' name='deadline' value={formData.deadline} onChange={handleChange} className='w-full p-2 rounded text-black' />

        <div>
          <label className='block mb-2'>Eligible Branches:</label>
          {branches.map(branch => (
            <label key={branch} className='inline-block mr-4'>
              <input
                type='checkbox'
                name='eligibleBranches'
                value={branch}
                checked={formData.eligibleBranches.includes(branch)}
                onChange={handleChange}
                className='mr-1'
              />
              {branch}
            </label>
          ))}
        </div>

        <select name='jobStatus' value={formData.jobStatus} onChange={handleChange} className='w-full p-2 rounded text-black'>
          <option value='open'>Open</option>
          <option value='closed'>Closed</option>
          <option value='upcoming'>Upcoming</option>
        </select>

        <button type='submit' className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>Create Job</button>
      </form>
    </div>
  );
}

export default CreateJob;
