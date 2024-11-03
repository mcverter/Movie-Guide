import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';

import { movieDetailApi } from "../../services/requests/api";
import { DefaultRootState } from "../../services/store/interfaces";
import { cleaningPreviousState } from "../../services/store/modules/Global/actions";
import {
  handleMovieCast,
  handleMovieDetails,
  handleMovieRecommendations,
  handleMovieTrailer
} from "../../services/store/modules/MovieDetails/actions";

import { MovieBanner } from '../../components/Movies/MovieBanner';
import { MovieCredits } from '../../components/Movies/MovieCredits';
import { MoviesList } from "../../components/Movies/MoviesList";

export default function MovieDetails() {
  //@ts-ignore
  const { VITE_API_KEY } = process.env;

  const { movieRecommendations } = useSelector((state): DefaultRootState => state);

  const dispatch = useDispatch();

  const { id } = useParams();
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [isRecommendation] = useState<boolean | undefined>(Boolean(movieRecommendations));

  const getMovieDetails = (id: string | undefined) => {
    const appendItems = 'credits,videos,release_dates';

    movieDetailApi
      .get(`${id}?api_key=${VITE_API_KEY}&append_to_response=${appendItems}&language=en-US`)
      .then(({ data }) => {

        dispatch(handleMovieDetails(data, setDetailsLoading));
        dispatch(handleMovieTrailer(data.videos.results));
        dispatch(handleMovieCast(data.credits.cast));

      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMovieRecommendations = (id: string | undefined) => {
    movieDetailApi
      .get(`${id}/recommendations?api_key=${VITE_API_KEY}&language=en-US&page=1`)
      .then(({ data }) => {
        const { results } = data;
        dispatch(handleMovieRecommendations(results));
      })
      .catch((error) => {
        console.log(error);
      });

  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    getMovieDetails(id);
    getMovieRecommendations(id);
    scrollToTop();
    return () => {
      dispatch(cleaningPreviousState())
    };
  }, [id]);

  return (
    <>
      <MovieBanner detailsLoading={detailsLoading} />
      <MovieCredits />
      <MoviesList moviesToRender={movieRecommendations} isRecommendation={isRecommendation} />
    </>
  );
}

