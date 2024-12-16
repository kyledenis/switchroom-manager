import React from 'react';
import { AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '../../../contexts/ThemeContext';
import {
    SearchContainer,
    SearchButton,
    SearchBoxContainer,
    SearchInput,
    IconButton
} from '../styles/SearchStyles';

const SearchBox = ({
    isSearchOpen,
    searchQuery,
    searchInputRef,
    handleSearchToggle,
    handleSearchKeyDown,
    setSearchQuery
}) => {
    const { theme } = useTheme();

    const handleClear = (e) => {
        e.stopPropagation();
        setSearchQuery("");
        searchInputRef.current?.focus();
    };

    return (
        <SearchContainer>
            <AnimatePresence>
                {isSearchOpen && (
                    <SearchBoxContainer
                        theme={theme}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <SearchIcon style={{ opacity: 0.7 }} />
                        <SearchInput
                            ref={searchInputRef}
                            placeholder="Search location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            theme={theme}
                        />
                        {searchQuery && (
                            <IconButton
                                onClick={handleClear}
                                theme={theme}
                                aria-label="Clear search"
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </SearchBoxContainer>
                )}
            </AnimatePresence>
            <SearchButton
                onClick={handleSearchToggle}
                theme={theme}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
                <SearchIcon />
            </SearchButton>
        </SearchContainer>
    );
};

export default SearchBox;
