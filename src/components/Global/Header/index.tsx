import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';

import {searchApi} from '../../../services/requests/api';

import Logo from '../../../assets/logo.svg';

import {
    Container,
    SearchedOptions,
    StyledAutocomplete,
    StyledMenu,
    StyledMenuButton,
    StyledMenuItem,
    StyledTextField
} from './styles';

import {
    CircularProgress,
    Skeleton
} from '@mui/material';

import {searchedMovies} from './interfaces';
import {handleSearchedTerm} from '../../../services/store/modules/Global/actions';
import {DefaultRootState} from '../../../services/store/interfaces';

export const Header = () => {
    //@ts-ignore
    const {VITE_API_KEY} = process.env;

    const {searchedMovies} = useSelector((state): DefaultRootState => state);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [dropDown, setDropDown] = useState<any>('');
    const [searchedTerm, setSearchedTerm] = useState<string>('Avengers');
    const [searchLoading, setSearchLoading] = useState<boolean>(false);

    const menuItems = [
        {
            menuButton: 'Movies',
            menuItems: ['Popular', 'Top Rated', 'Now Playing', 'Upcoming Releases']
        },
        {
            menuButton: 'People',
            menuItems: ['Popular']
        },
        {
            menuButton: 'Profile',
            menuItems: ['My Profile']
        }
    ];

    const getSearchedTerm = (searchedTerm: string) => {
        searchApi
            .get(`multi?api_key=${VITE_API_KEY}&language=en-US&page=1&query=${searchedTerm}`)
            .then(({data}) => {
                const {results} = data;
                dispatch(handleSearchedTerm(results, setSearchLoading));
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleLoadingState = (searchedTerm: string) => {
        searchedTerm ? setSearchLoading(true) : setSearchLoading(false);
    }

    const handleNavigate = (menuButton: string, menuItem: string) => {

       if (menuButton === 'People') {
            navigate('/person/popular')
            return;
        }

        switch (menuItem) {
            case 'Popular':
                navigate('/')
                break;
            case 'Top Rated':
                navigate('/top-rated')
                break;
            case 'Now Playing':
                navigate('/now-playing')
                break;
            case 'Upcoming Releases':
                navigate('/upcoming')
                break
            case 'My Profile':
                navigate('/profile/my-profile')
                break;
            default:
                navigate('/'); }

    }

    const onClose = () => setDropDown('');

    useEffect(() => {
        getSearchedTerm(searchedTerm);
        handleLoadingState(searchedTerm);
    }, [searchedTerm]);

    return (
        <Container>
            <div>
                <img src={Logo} onClick={() => navigate('/')}/>
                <nav>

                    {menuItems.map(({menuButton}) => (
                        <StyledMenuButton
                            key={menuButton}
                            onClick={(e) => {
                                setDropDown(e.currentTarget)
                            }}
                        >
                            {menuButton}
                        </StyledMenuButton>
                    ))}

                    {menuItems.map(({menuItems, menuButton}) => (

                        <StyledMenu
                            anchorEl={dropDown}
                            key={menuButton}
                            open={menuButton === dropDown.innerText}
                            onClose={onClose}
                        >
                            {menuItems.map(item => (

                                <StyledMenuItem
                            key={menuButton}
                                    onClick={() => {
                                        handleNavigate(menuButton, item)
                                        onClose();
                                    }}
                                >
                                    {item}
                                </StyledMenuItem>

                            ))}
                        </StyledMenu>

                    ))}

                </nav>
               <StyledAutocomplete
                    clearOnEscape
                    freeSolo
                    noOptionsText={'No titles found.'}
                    //@ts-ignore
                    groupBy={({media_type}) => media_type === 'movie' ? 'Movies' : 'People'}
                    options={searchedMovies?.sort((a, b): any => b.popularity - a.popularity)}
                    getOptionLabel={(item: searchedMovies | any) => item.title}
                    renderInput={(params) => (
                        <StyledTextField {...params}
                                         size="small"
                                         placeholder='Search for movies or people...'
                                         onChange={(e) => setSearchedTerm(e.target.value)}
                                         InputProps={{
                                             ...params.InputProps,
                                             style: {
                                                 color: 'var(--grey)',
                                                 fontFamily: 'DM Sans',
                                                 fontSize: 14
                                             },
                                             endAdornment: (
                                                 <>
                                                     {searchLoading ?
                                                         <CircularProgress
                                                             size={16}
                                                             sx={{
                                                                 color: "var(--primary)",
                                                                 marginRight: 4
                                                             }}
                                                         />
                                                         : null}
                                                     {params.InputProps.endAdornment}
                                                 </>
                                             )
                                         }}
                        />
                    )}
                    renderOption={(props, {title, vote_average, release_date, poster_path}: searchedMovies | any) => (
                        <SearchedOptions {...props} voteAverage={vote_average}>
                            <>
                                {searchLoading ? (
                                    <Skeleton variant="rectangular" width="15%" height="60px" animation="wave" sx={{
                                        borderRadius: '5px',
                                        marginLeft: '5px',
                                        padding: '5px'
                                    }}/>
                                ) : (
                                    <img src={`https://image.tmdb.org/t/p/w200/${poster_path}`} alt=""/>
                                )}
                                {searchLoading ? (
                                    <Skeleton variant="text" height="40px" width="100%" animation="wave"/>
                                ) : (
                                    <>
                                        <span>{title}</span>
                                        <span>{vote_average && Math.round(vote_average*10).toString() + '%'}</span>
                                        <span>{release_date?.split('-')[0] || ''}</span>
                                    </>
                                )}
                            </>
                        </SearchedOptions>
                    )}
                    onChange={(e, {media_type, id}: any) => {
                        navigate(`/${media_type}/${id}`)
                    }}
                />
            </div>

        </Container>
    );
}

