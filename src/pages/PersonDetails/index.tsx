import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { personApi } from "../../services/requests/api";
import { handlePersonDetails } from "../../services/store/modules/PersonDetails/actions";
import { DefaultRootState } from "../../services/store/interfaces";

import { PersonBanner } from "../../components/Person/PersonBanner";
import { PersonCredits } from "../../components/Person/PersonCredits";
import { MoviesList } from "../../components/Movies/MoviesList";

import { Container, ContainerPerson } from './styles';

export default function PersonDetails() {
  //@ts-ignore
  const { VITE_API_KEY } = process.env;

  const { id } = useParams();
  const [detailsLoading, setDetailsLoading] = useState(true);
  const dispatch = useDispatch();
  const { personDetails, addedMoviesObj } = useSelector((state): DefaultRootState => state);

  const {
    personBanner,
    personFilmography,
    personMovieDetails
  }: any = personDetails;

  const getPersonDetails = (id: string | number | undefined) => {
    personApi
      .get(`${id}?api_key=${VITE_API_KEY}&&append_to_response=movie_credits&language=en-US`)
      .then(({ data }) => {
        dispatch(handlePersonDetails(data, setDetailsLoading))
      }).catch((error) => {
        console.log(error);
      })

  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    getPersonDetails(id);
    scrollToTop()
  }, [id])

  const handlePersonMoviesWatched = () => {
    const personMoviesIDs = personFilmography?.map(({ id }: any) => id);
    const personWatchedMoviesCount = addedMoviesObj?.watchedMovies?.filter(({ id }) => personMoviesIDs?.includes(id))?.length
    return personWatchedMoviesCount;
  }

  return (
    <ContainerPerson>
      <PersonBanner
        personBanner={personBanner}
        detailsLoading={detailsLoading}
      />
      <Container>
        <PersonCredits personDetails={personMovieDetails} />
        <section>
          <h2>Filmography</h2>
          <p>Have you seen {handlePersonMoviesWatched()} of {personMovieDetails?.moviesCount} films by this actor</p>
          <MoviesList moviesToRender={personFilmography} isPersonDetails={true}/>
        </section>
      </Container>
    </ContainerPerson>
  );
}

