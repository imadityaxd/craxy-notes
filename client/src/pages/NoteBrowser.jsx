// client/src/pages/NoteBrowser.jsx

import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import useFetchNotes from '../hooks/useFetchNotes';
import NoteCard from '../components/NoteCard'; 
import { Search, Filter } from 'lucide-react'; 
import { FOET_BRANCHES, getSubjects } from '../utils/syllabusData'; // Import accurate data map

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Component to display notes in a responsive multi-column grid
const SubjectNotesGrid = ({ subject, selectedBranch, selectedSemester }) => {
    
    const hasNotes = subject.items && subject.items.length > 0;

    // FIND OFFICIAL SUBJECT NAME: Use the getSubjects helper to look up the official title
    const officialSubjects = getSubjects(selectedBranch, selectedSemester);
    const officialSubject = officialSubjects.find(s => s.code === subject.courseCode);
    
    // Fallback title: Use the official title if found, otherwise stick with the API title.
    const displayTitle = officialSubject ? officialSubject.title : subject.title;

    return (
        // Simplified shadow and padding for a cleaner look
        <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg border border-gray-100">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-3 border-b pb-2">
                {/* CRITICAL FIX: Displaying Official Title */}
                {subject.courseCode}: {displayTitle}
            </h3>
            
            {hasNotes ? (
                // CRITICAL FIX: The multi-grid applies to the individual notes list (subject.items)
                // Grid remains simple, prioritizing 2 columns over 3 on tablets for better card space.
                <div className="grid gap-4 
                              grid-cols-1   /* Mobile (default) */ 
                              md:grid-cols-2 /* Medium/Tablet (2 columns) */ 
                              lg:grid-cols-3 /* Large Screens/Desktop (3 columns) */
                              xl:grid-cols-4 /* Extra Large Screens (4 columns) */
                              ">
                    {subject.items.map(note => (
                        // NoteCard style handles the internal 'w-full' for its grid cell
                        <NoteCard key={note.id} note={note} /> 
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 italic text-sm">No files uploaded yet for this subject.</p>
            )}
        </div>
    );
};


const NoteBrowser = () => {
    // 1. Get parameters from the URL (e.g., /notes/CSE/3)
    let { branch: urlBranch, semester: urlSemester } = useParams();
    
    // Import navigation function
    const navigate = useNavigate(); 
    
    // Convert semester to number for API consistency
    const selectedBranch = urlBranch ? urlBranch.toUpperCase() : null;
    const selectedSemester = urlSemester ? parseInt(urlSemester) : null;
    
    // 2. SEARCH STATE
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // 3. FILTER STATE: Manage which specific subject the user has selected
    const [selectedSubjectCode, setSelectedSubjectCode] = useState(null); 
    
    // 4. Fetch data using the custom hook
    const { notes, loading, error } = useFetchNotes(selectedBranch, selectedSemester);

    // Get human-readable names for display (using imported data)
    const branchName = FOET_BRANCHES.find(b => b.code === selectedBranch)?.name || selectedBranch;
    
    // Get the full list of expected subjects for this semester (from syllabusData.js)
    const expectedSubjects = getSubjects(selectedBranch, selectedSemester); 
    
    // 5. Apply FILTERS (Search Term)
    const finalFilteredNotes = notes.map(subjectGroup => {
        // Step A: Filter by Search Term (Case-insensitive match on note title)
        const searchedItems = subjectGroup.items.filter(note => 
            note.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Return a new subject group object with only the matching notes
        return {
            ...subjectGroup,
            items: searchedItems
        };
    }).filter(subjectGroup => subjectGroup.items.length > 0); // Remove subject groups with no results


    // Filter by Subject Code (applied last)
    const displayNotes = selectedSubjectCode 
        ? finalFilteredNotes.filter(noteGroup => noteGroup.courseCode === selectedSubjectCode)
        : finalFilteredNotes;


    // Helper functions 
    const handleBranchChange = (event) => {
        const newBranchCode = event.target.value;
        // Reset subject filter when branch changes
        setSelectedSubjectCode(null); 
        navigate(`/notes/${newBranchCode}/${selectedSemester || 1}`);
    };

    const handleSubjectFilterChange = (event) => {
        const code = event.target.value;
        setSelectedSubjectCode(code === 'ALL' ? null : code);
    };

    const handleSemesterChange = (newSemester) => {
        // Reset subject filter when semester changes
        setSelectedSubjectCode(null); 
        navigate(`/notes/${selectedBranch}/${newSemester}`);
    };
    
    if (loading) {
        return <div className="text-center p-8 text-lg font-semibold text-gray-600">Loading notes...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-lg text-red-500">Error: {error}</div>;
    }

    // Determine if any filters are active
    const isFilterActive = selectedBranch && selectedSemester;

    return (
        <div className="flex flex-col lg:flex-row min-h-full">
            
            {/* --- Sidebar Navigation (Hierarchy & Subject Filter) --- */}
            {/* Sidebar width adjusted for better balance on desktop */}
            <div className="w-full lg:w-72 bg-white p-4 shadow-2xl lg:h-screen lg:sticky lg:top-0 border-r border-gray-100">
                <h3 className="text-xl font-bold text-blue-800 mb-4 border-b pb-2">FOET Hierarchy</h3>
                
                {/* Search Bar */}
                <div className="mb-4 relative">
                    <input 
                        type="text" 
                        placeholder="Search Note Titles..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-8 border rounded-lg text-sm bg-gray-50 focus:border-blue-500" 
                        disabled={!isFilterActive}
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
                    {!isFilterActive && <p className="text-xs text-red-500 absolute top-0 right-0">Select Branch/Sem first</p>}
                </div>
                
                {/* 1. Branch Selector */}
                <div className="border-t pt-4 mb-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Select Branch:</h4>
                    <select
                        value={selectedBranch || FOET_BRANCHES[0].code}
                        onChange={handleBranchChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {FOET_BRANCHES.map(b => (
                            <option key={b.code} value={b.code}>{b.name} ({b.code})</option>
                        ))}
                    </select>
                </div>

                {/* 2. Semester Links */}
                {selectedBranch && (
                    <div className="border-t pt-4 mb-6">
                        <h4 className="text-md font-semibold text-gray-700 mt-4 mb-2">Select Semester:</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-4 gap-2">
                            {SEMESTERS.map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => handleSemesterChange(s)} 
                                    className={`text-center p-2 rounded-lg font-semibold text-xs transition duration-150 ${s === selectedSemester ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* 3. Subject Filter */}
                {isFilterActive && (
                    <div className="mb-6 border-t pt-4">
                        <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center space-x-2">
                             <Filter className='w-4 h-4 text-blue-500'/>
                             <span>Filter by Subject:</span>
                        </h4>
                        
                        <select
                            value={selectedSubjectCode === null ? 'ALL' : selectedSubjectCode}
                            onChange={handleSubjectFilterChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="ALL">Show All Subjects ({expectedSubjects.length} available)</option> 
                            {expectedSubjects.map(subject => (
                                <option 
                                    key={subject.code} 
                                    value={subject.code}
                                >
                                    {subject.code} - {subject.title}
                                </option>
                            ))}
                        </select>
                         
                        {selectedSubjectCode && (
                            <button
                                onClick={() => setSelectedSubjectCode(null)}
                                className="mt-2 w-full text-center text-xs text-red-500 hover:text-red-700"
                            >
                                Clear Subject Filter
                            </button>
                        )}
                    </div>
                )}

            </div>
            
            {/* --- Main Content Area (Notes List) --- */}
            {/* Reduced padding on mobile (p-4) but increased on large screens (lg:p-8) */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8"> 
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                    {branchName} - Semester {selectedSemester || 'Select Below'}
                </h1>
                
                {searchTerm && (
                    <p className="text-md font-semibold text-orange-600 mb-4">
                        Search results for: "{searchTerm}"
                    </p>
                )}

                <p className="text-md text-gray-500 mb-6">
                    {selectedSubjectCode 
                        ? `Displaying filtered results for: ${selectedSubjectCode}` 
                        : 'Showing all subjects and available materials.'}
                </p>

                {!isFilterActive ? (
                     <div className="text-center p-10 sm:p-20 bg-blue-50 rounded-xl border border-blue-200">
                        <h3 className="text-xl font-semibold text-blue-700">Get Started</h3>
                        <p className="text-gray-600">Please select a **Branch** and **Semester** from the left panel to load the syllabus and available notes.</p>
                    </div>
                ) : displayNotes.length === 0 ? (
                    <div className="text-center p-10 sm:p-20 bg-gray-100 rounded-xl">
                        <h3 className="text-xl font-semibold text-gray-500">No Results Found</h3>
                        <p className="text-gray-400">Your search or filter combination yielded no available materials.</p>
                    </div>
                ) : (
                    <div className="space-y-6"> {/* Reduced space-y for mobile */}
                        {/* Map over the FILTERED notes list */}
                        {displayNotes.map(subject => (
                            <SubjectNotesGrid 
                                key={subject.courseCode} 
                                subject={subject} 
                                selectedBranch={selectedBranch} 
                                selectedSemester={selectedSemester} 
                            /> // Pass context to SubjectNotesGrid
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteBrowser;