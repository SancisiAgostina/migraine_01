# Backend - Sistema de orientación sobre cefaleas

## Descripción

Este proyecto implementa el **backend** de un sistema de orientación sobre cefaleas, desarrollado en **Python**.  
El objetivo es clasificar, a partir de respuestas del usuario, si el cuadro es compatible con:

- **Migraña con aura**
- **Migraña sin aura**
- **Cefalea tensional**
- **No concluyente**

El sistema está diseñado con una estructura **modular** y una lógica basada en **árboles de decisión**, para que sea más claro, mantenible y escalable.

---

## Objetivo del backend

El backend se encarga de:

- realizar preguntas al usuario
- validar las respuestas ingresadas
- almacenar las respuestas en memoria
- evaluar la lógica diagnóstica
- recorrer el árbol de decisión
- devolver un resultado final

Este sistema tiene fines **educativos** y **no reemplaza una consulta médica profesional**.

---

## Tecnologías utilizadas

- **Python 3**
- Programación modular
- Árboles de decisión
- Validación de entrada por consola

---

## Estructura del proyecto

```text
proyecto_migrana/
│
├── main.py
├── texts.py
├── utils.py
├── rules.py
├── tree_nodes.py
├── tree_builder.py
└── questionnaire.py


Descripción de cada archivo
main.py
Es el punto de entrada del programa.
 Coordina la ejecución general del sistema:
selección de idioma


carga de preguntas


evaluación del árbol


impresión del resultado final


texts.py
Contiene todos los textos del sistema en ambos idiomas:
español


inglés


Incluye:
preguntas


mensajes de error


resultados


advertencias


etiquetas de resumen


utils.py
Contiene funciones auxiliares generales, como:
selección de idioma


normalización de texto


validación de respuestas sí/no


conteo de valores booleanos verdaderos


rules.py
Contiene la lógica diagnóstica simplificada.
 Aquí se evalúan las condiciones compatibles con:
migraña con aura


migraña sin aura


cefalea tensional


tree_nodes.py
Define las clases que representan los nodos del árbol de decisión:
LeafNode


QuestionNode


DecisionNode


tree_builder.py
Construye el árbol de decisión completo del sistema, definiendo:
la raíz


las ramas


las hojas diagnósticas


questionnaire.py
Se encarga de:
hacer las preguntas al usuario


guardar respuestas


validar contradicciones básicas


mostrar el resumen de respuestas



Lógica del sistema
El backend utiliza un árbol de decisión.
Raíz del árbol
La raíz principal es la presencia de síntomas compatibles con aura antes del dolor de cabeza.
Pregunta base:
¿Tuviste cambios visuales, hormigueo o dificultad para hablar antes del dolor de cabeza?


Ramas principales
Si la respuesta es sí
Se evalúan criterios del aura:
aparición gradual


duración entre 5 y 60 minutos


cefalea posterior dentro de 1 hora


Si cumple suficientes criterios:
Migraña con aura


Si no:
se continúa evaluando migraña sin aura


Si la respuesta es no
Se evalúan criterios de:
Migraña sin aura


luego cefalea tensional


Hojas del árbol
Los diagnósticos finales posibles son:
Compatible con migraña con aura


Compatible con migraña sin aura


Compatible con cefalea tensional


No concluyente



Validaciones implementadas
El sistema incluye validaciones para mejorar la robustez de la entrada del usuario.
Validación de idioma
Acepta:
es


en


No distingue mayúsculas y minúsculas.
Validación de respuestas sí/no
En español acepta:
si


sí


s


no


n


En inglés acepta:
yes


y


no


n


También:
ignora espacios al inicio y al final


vuelve a preguntar si la respuesta es inválida


soporta mayúsculas y minúsculas


Validación de contradicciones básicas
El sistema detecta algunas respuestas incoherentes, por ejemplo:
marcar que el dolor fue unilateral y también bilateral


marcar que el dolor fue leve/moderado y también moderado/fuerte


Estas contradicciones no detienen la ejecución, pero se muestran como advertencias.

Criterios simplificados utilizados
Migraña con aura
Se considera compatible si:
hubo síntomas de aura antes del dolor


y se cumplen al menos 2 criterios temporales del aura


Migraña sin aura
Se considera compatible si:
la duración del dolor es compatible


hay al menos 2 características típicas del dolor migrañoso


hay síntomas asociados compatibles


Cefalea tensional
Se considera compatible si:
la duración es compatible


hay al menos 2 características típicas de tensión


no hay náuseas


no hay fotofobia y fonofobia al mismo tiempo
