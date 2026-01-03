import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./BlogDetail.css";

export default function BlogDetail() {
  const { state } = useLocation();
  const { slug } = useParams();

  const blog = state?.blog;

  const blogs = {
    title: "How to Increase Your Home’s Curb Appeal in a Weekend",
    slug: "increase-home-curb-appeal",
    image: "/assets/g1.png",
    date: "Feb 19, 2025",
    category: "News",
    content:
      "<h1> Brilliant design strategies & marketing consectetur.Ectus sed consequat magna aliquet feugiat diam. Nunc arcu justo nulla elit egestas habitant feugiat nam.</h1> <p> Lorem ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino quetambién ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con lacreación de las hojas Letraset. </p> <p> Las hojas Letraset, las cuales contenían pasajes de Lorem Ipsum, y más recientemente con software de autoedición como Aldus PageMaker, el cual incluye versiones de Lorem Ipsum. </p> <blockquote> creación de las hojas Letraset; las cuales contenían pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum. </blockquote> <h2>What You Should Do Now</h2> <p> Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Ha sido el estándar para impresión desde el año 1500, usado para mostrar tipografía, distribución visual y estructura. No sólo sobrevivió medio milenio, también se adaptó al mundo digital manteniendo su esencia visual.</p>, <h2>Lorem ipsum dolor sit amet consectetur. Senectus sed consequat magna aliquet feugiat diam.</h2> <p> Lorem ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Conocido por su estructura balanceada y distribución visual, permite evaluar diseños sin distracciones. Ha sido una herramienta fundamental en diseño gráfico, impresión y publicaciones digitales. Su versatilidad lo mantiene vigente como estándar en la industria. </p>",
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    async function loadBlog() {
      const res = await fetch(`${BASE_URL}/api/blog/${slug}`);
      const data = await res.json();
      setBlog(data);
    }
    loadBlog();
  }, [slug]);

  if (!blog) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="blog-detail-container">
      <h1 className="blog-title">{blog.description}</h1>

      <img src={blog.imageUrl} alt={blog.title} className="blog-detail-image" />

      <div className="blog-meta">
        <span className="blog-category">News</span>
        <span className="blog-date">Publish Feb 19, 2025</span>
      </div>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
      />
    </div>
  );
}
