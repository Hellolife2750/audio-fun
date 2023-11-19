import React from 'react';
import { formatInput } from '../utils';

const SearchBar: React.FC<{ masterSetKeyWords: (keyWords: string) => void }> = ({ masterSetKeyWords }) => {



    return (
        <div id="search-bar">
            <div className="search-bar-container">
                <input type="text" className="search-input" placeholder="Rechercher..." onChange={(e) => masterSetKeyWords(formatInput(e.currentTarget.value))} />
                <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <button className="interactable">
                <i className="fa-solid fa-list"></i>
            </button>
        </div>
    );
};

export default SearchBar;