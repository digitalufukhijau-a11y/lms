-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses: Public can read published, instructors can manage own
CREATE POLICY "Published courses are viewable by everyone"
  ON public.courses FOR SELECT
  USING (status = 'published' OR instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (
    auth.uid() = instructor_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Instructors can update own courses"
  ON public.courses FOR UPDATE
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can delete own courses"
  ON public.courses FOR DELETE
  USING (instructor_id = auth.uid());

-- Chapters: Viewable if course is accessible
CREATE POLICY "Chapters viewable if course accessible"
  ON public.chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND (
        status = 'published' OR
        instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = courses.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage chapters"
  ON public.chapters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- Lessons: Same as chapters
CREATE POLICY "Lessons viewable if course accessible"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chapters c
      JOIN public.courses co ON c.course_id = co.id
      WHERE c.id = chapter_id AND (
        co.status = 'published' OR
        co.instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = co.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage lessons"
  ON public.lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.chapters c
      JOIN public.courses co ON c.course_id = co.id
      WHERE c.id = chapter_id AND co.instructor_id = auth.uid()
    )
  );

-- Enrollments: Students can enroll, view own
CREATE POLICY "Students can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in courses"
  ON public.enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Lesson Progress: Students can manage own
CREATE POLICY "Students can view own progress"
  ON public.lesson_progress FOR SELECT
  USING (student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.chapters c ON l.chapter_id = c.id
      JOIN public.courses co ON c.course_id = co.id
      WHERE l.id = lesson_id AND co.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can modify own progress"
  ON public.lesson_progress FOR UPDATE
  USING (student_id = auth.uid());

-- Course Reviews: Students can review enrolled courses
CREATE POLICY "Reviews are viewable by everyone"
  ON public.course_reviews FOR SELECT
  USING (true);

CREATE POLICY "Students can review enrolled courses"
  ON public.course_reviews FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE course_id = course_reviews.course_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own reviews"
  ON public.course_reviews FOR UPDATE
  USING (student_id = auth.uid());

-- Quizzes: Viewable if enrolled
CREATE POLICY "Quizzes viewable if enrolled"
  ON public.quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND (
        instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = courses.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage quizzes"
  ON public.quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- Questions & Options: Same as quizzes
CREATE POLICY "Questions viewable if quiz accessible"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.courses c ON q.course_id = c.id
      WHERE q.id = quiz_id AND (
        c.instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = c.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage questions"
  ON public.questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.courses c ON q.course_id = c.id
      WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Options viewable if question accessible"
  ON public.question_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.questions qu
      JOIN public.quizzes qz ON qu.quiz_id = qz.id
      JOIN public.courses c ON qz.course_id = c.id
      WHERE qu.id = question_id AND (
        c.instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = c.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage options"
  ON public.question_options FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.questions qu
      JOIN public.quizzes qz ON qu.quiz_id = qz.id
      JOIN public.courses c ON qz.course_id = c.id
      WHERE qu.id = question_id AND c.instructor_id = auth.uid()
    )
  );

-- Quiz Attempts: Students can view own
CREATE POLICY "Students can view own attempts"
  ON public.quiz_attempts FOR SELECT
  USING (student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.courses c ON q.course_id = c.id
      WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can create attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own attempts"
  ON public.quiz_attempts FOR UPDATE
  USING (student_id = auth.uid());

-- Quiz Answers: Students can manage own
CREATE POLICY "Students can view own answers"
  ON public.quiz_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE id = attempt_id AND student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.quizzes q ON qa.quiz_id = q.id
      JOIN public.courses c ON q.course_id = c.id
      WHERE qa.id = attempt_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit answers"
  ON public.quiz_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts
      WHERE id = attempt_id AND student_id = auth.uid()
    )
  );

-- Notifications: Users can view own
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Certificates: Students can view own
CREATE POLICY "Students can view own certificates"
  ON public.certificates FOR SELECT
  USING (student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND instructor_id = auth.uid()
    )
  );

-- Public certificate verification
CREATE POLICY "Certificates verifiable by certificate number"
  ON public.certificates FOR SELECT
  USING (true);

-- Live Sessions: Viewable if enrolled
CREATE POLICY "Sessions viewable if enrolled"
  ON public.live_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND (
        instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = courses.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage sessions"
  ON public.live_sessions FOR ALL
  USING (instructor_id = auth.uid());

-- Attendances: Students can view own
CREATE POLICY "Students can view own attendance"
  ON public.attendances FOR SELECT
  USING (student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.live_sessions ls
      WHERE ls.id = session_id AND ls.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can record attendance"
  ON public.attendances FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Announcements: Viewable if enrolled
CREATE POLICY "Announcements viewable if enrolled"
  ON public.announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND (
        instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = courses.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Instructors can manage announcements"
  ON public.announcements FOR ALL
  USING (instructor_id = auth.uid());

-- Discussion: Viewable if enrolled
CREATE POLICY "Discussions viewable if enrolled"
  ON public.discussion_threads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND (
        instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = courses.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Enrolled users can create discussions"
  ON public.discussion_threads FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE course_id = discussion_threads.course_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own threads"
  ON public.discussion_threads FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Replies viewable if thread accessible"
  ON public.discussion_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.discussion_threads dt
      JOIN public.courses c ON dt.course_id = c.id
      WHERE dt.id = thread_id AND (
        c.instructor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.enrollments
          WHERE course_id = c.id AND student_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Enrolled users can reply"
  ON public.discussion_replies FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.discussion_threads dt
      JOIN public.enrollments e ON dt.course_id = e.course_id
      WHERE dt.id = thread_id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own replies"
  ON public.discussion_replies FOR UPDATE
  USING (author_id = auth.uid());
