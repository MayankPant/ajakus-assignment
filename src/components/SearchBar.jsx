import { Search  as SearchIcon } from "@mui/icons-material"
import { TextField } from "@mui/material"

const SearchBar = ({searchTerm}) => {
    return (
        <>
        <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search users..."
              InputProps={{ disableUnderline: true }}
            />
        
        </>
    )
}

export default SearchBar;