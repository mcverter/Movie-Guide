import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";

import { 
  ButtonContainer, 
  Container, 
  GenreButton, 
} from './styles';

import { DefaultRootState } from "../../../services/store/interfaces";
import { handleSelectedGenres } from '../../../services/store/modules/Home/actions';

export const GenresBanner = () => {
  const { moviesGenres, selectedGenres } = useSelector((state): DefaultRootState => state);
  const dispatch = useDispatch();

  const imageBaseURL = 'https://www.themoviedb.org/t/p/'
  const cover = '/tNE9HGcFOH8EpCmzO7XCYwqguI0.jpg'
  const backdropCover = imageBaseURL + 'original' + cover;

  return (
    <Container backDrop={backdropCover}>
      <div>
<h1>Millions of Movies and People to Discover. Explore now.</h1>
        <div>
          <p>FILTER BY:</p>
          <ButtonContainer>
            {moviesGenres.map(({ id, name }) => (
              <GenreButton
                key={id}
                style={{
                  backgroundColor: selectedGenres?.some(selectedGenre => selectedGenre === id) ? 
                                    'var(--primary)' : 
                                    'var(--light)'
                }}
                onClick={() => {
                  dispatch(handleSelectedGenres(id))
                }}
              >
                {name}
                
                {selectedGenres?.some(selectedGenre => selectedGenre === id) && (
                  <MdCancel
                    size={18}
                  />
                )}
              </GenreButton>
            ))}
          </ButtonContainer>
        </div>
      </div>

    </Container>
  );
}

